import { NextResponse } from "next/server";
import { getCachedShakalImage } from "@/lib/shakalizer/cache";
import {
  IMAGE_DELAY_RANGE_MS,
  IMAGE_STREAM_CHUNK_BYTES,
  IMAGE_STREAM_CHUNK_DELAY_RANGE_MS,
} from "@/lib/shakalizer/constants";
import { shakalizeImageFromUrl } from "@/lib/shakalizer/image-proxy";
import {
  normalizeTargetUrl,
  sleep,
  stableIntInRangeFromString,
} from "@/lib/shakalizer/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createStreamingResponse(
  buffer: Buffer,
  chunkDelayMs: number,
  headers: Record<string, string>,
): Response {
  const cancelled = { value: false };

  const stream = new ReadableStream({
    start(controller) {
      let offset = 0;

      function push() {
        if (cancelled.value) {
          return;
        }

        if (offset >= buffer.length) {
          controller.close();
          return;
        }

        const end = Math.min(offset + IMAGE_STREAM_CHUNK_BYTES, buffer.length);
        controller.enqueue(buffer.subarray(offset, end));
        offset = end;

        if (offset < buffer.length) {
          setTimeout(push, chunkDelayMs);
        } else {
          controller.close();
        }
      }

      push();
    },
    cancel() {
      cancelled.value = true;
    },
  });

  return new Response(stream, {
    status: 200,
    headers,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl?.trim()) {
    return NextResponse.json(
      { error: "Нужен URL изображения для шакализации." },
      { status: 400 },
    );
  }

  try {
    const normalizedImageUrl = normalizeTargetUrl(imageUrl);
    const cacheKey = normalizedImageUrl.toString();
    const cachedImage = getCachedShakalImage(cacheKey);

    if (!cachedImage) {
      const delayMs = stableIntInRangeFromString(
        cacheKey,
        IMAGE_DELAY_RANGE_MS.min,
        IMAGE_DELAY_RANGE_MS.max,
      );

      await sleep(delayMs);
    }

    const buffer =
      cachedImage ?? (await shakalizeImageFromUrl(normalizedImageUrl.toString()));

    const chunkDelayMs = stableIntInRangeFromString(
      `${cacheKey}::chunk-speed`,
      IMAGE_STREAM_CHUNK_DELAY_RANGE_MS.min,
      IMAGE_STREAM_CHUNK_DELAY_RANGE_MS.max,
    );

    return createStreamingResponse(buffer, chunkDelayMs, {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=1800",
    });
  } catch (error) {
    console.error("Shakal image route failed", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось скачать и испортить изображение.",
      },
      { status: 502 },
    );
  }
}
