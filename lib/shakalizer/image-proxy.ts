import sharp from "sharp";
import {
  IMAGE_FETCH_TIMEOUT_MS,
  MAX_IMAGE_BYTES,
  TRUSTED_DESKTOP_USER_AGENT,
} from "@/lib/shakalizer/constants";
import { getOrCreateCachedShakalImage } from "@/lib/shakalizer/cache";
import { runImageProcessingLimited } from "@/lib/shakalizer/limiters";
import {
  normalizeTargetUrl,
  readResponseBufferWithLimit,
} from "@/lib/shakalizer/utils";

sharp.concurrency(1);
sharp.cache(false);

const MIN_DEGRADED_SIDE = 24;
const MAX_DEGRADED_SIDE = 260;
const MAX_OUTPUT_SIDE = 1600;
const SCALE_FACTOR = 0.18;
const JPEG_QUALITY = 7;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getScaledDimensions(width: number, height: number) {
  const scaledWidth = clamp(
    Math.round(width * SCALE_FACTOR),
    MIN_DEGRADED_SIDE,
    MAX_DEGRADED_SIDE,
  );
  const scaledHeight = clamp(
    Math.round(height * SCALE_FACTOR),
    MIN_DEGRADED_SIDE,
    MAX_DEGRADED_SIDE,
  );

  return { scaledWidth, scaledHeight };
}

function getOutputDimensions(width: number, height: number) {
  const scale = Math.min(MAX_OUTPUT_SIDE / width, MAX_OUTPUT_SIDE / height, 1);

  return {
    outputWidth: Math.max(Math.round(width * scale), 1),
    outputHeight: Math.max(Math.round(height * scale), 1),
  };
}

function looksLikeBareBase64Payload(value: string): boolean {
  const normalized = value.replace(/\s+/g, "");

  if (normalized.length < 32) {
    return false;
  }

  if (
    normalized.includes("/") ||
    normalized.includes(".") ||
    normalized.includes(":") ||
    normalized.includes("?")
  ) {
    return false;
  }

  return /^[A-Za-z0-9+/=]+$/.test(normalized);
}

export function resolveRemoteAssetUrl(rawUrl: string, baseUrl: URL): URL | null {
  const trimmedUrl = rawUrl.trim();

  if (
    !trimmedUrl ||
    trimmedUrl.startsWith("data:") ||
    trimmedUrl.startsWith("blob:") ||
    trimmedUrl.startsWith("javascript:") ||
    trimmedUrl.startsWith("#") ||
    looksLikeBareBase64Payload(trimmedUrl)
  ) {
    return null;
  }

  const resolvedUrl = new URL(trimmedUrl, baseUrl);

  if (!["http:", "https:"].includes(resolvedUrl.protocol)) {
    return null;
  }

  return resolvedUrl;
}

export function buildShakalImageProxyUrl(imageUrl: URL, appOrigin: URL): string {
  return new URL(
    `/api/shakal-image?url=${encodeURIComponent(imageUrl.toString())}`,
    appOrigin,
  ).toString();
}

export function rewriteSrcsetThroughProxy(
  srcset: string,
  baseUrl: URL,
  appOrigin: URL,
): string | null {
  const rewrittenCandidates = srcset
    .split(",")
    .map((candidate) => candidate.trim())
    .filter(Boolean)
    .map((candidate) => {
      const [rawUrl, ...descriptorParts] = candidate.split(/\s+/);
      const resolvedUrl = resolveRemoteAssetUrl(rawUrl, baseUrl);

      if (!resolvedUrl) {
        return null;
      }

      const proxiedUrl = buildShakalImageProxyUrl(resolvedUrl, appOrigin);
      const descriptor = descriptorParts.join(" ");

      return descriptor ? `${proxiedUrl} ${descriptor}` : proxiedUrl;
    })
    .filter((candidate): candidate is string => Boolean(candidate));

  return rewrittenCandidates.length > 0
    ? rewrittenCandidates.join(", ")
    : null;
}

async function downloadRemoteImage(imageUrl: URL): Promise<Buffer> {
  const response = await fetch(imageUrl, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
    headers: {
      "user-agent": TRUSTED_DESKTOP_USER_AGENT,
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "accept-language": "ru,en-US;q=0.9,en;q=0.8",
      pragma: "no-cache",
      "cache-control": "no-cache",
      referer: imageUrl.origin,
    },
  });

  if (!response.ok) {
    throw new Error(`Изображение вернуло HTTP ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.startsWith("image/")) {
    throw new Error("Целевой ресурс не является изображением.");
  }

  return readResponseBufferWithLimit(response, MAX_IMAGE_BYTES);
}

async function degradeImageBuffer(inputBuffer: Buffer): Promise<Buffer> {
  const image = sharp(inputBuffer, { animated: false, pages: 1 }).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? 800;
  const height = metadata.height ?? 600;
  const { scaledWidth, scaledHeight } = getScaledDimensions(width, height);
  const { outputWidth, outputHeight } = getOutputDimensions(width, height);

  return image
    .flatten({ background: "#000000" })
    .resize({
      width: scaledWidth,
      height: scaledHeight,
      fit: "fill",
      kernel: sharp.kernel.nearest,
    })
    .resize({
      width: outputWidth,
      height: outputHeight,
      fit: "fill",
      kernel: sharp.kernel.nearest,
    })
    .jpeg({
      quality: JPEG_QUALITY,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: "4:2:0",
    })
    .toBuffer();
}

export async function shakalizeImageFromUrl(rawUrl: string): Promise<Buffer> {
  const imageUrl = normalizeTargetUrl(rawUrl);
  const cacheKey = imageUrl.toString();

  return getOrCreateCachedShakalImage(cacheKey, async () =>
    runImageProcessingLimited(async () => {
      const inputBuffer = await downloadRemoteImage(imageUrl);
      return degradeImageBuffer(inputBuffer);
    }),
  );
}
