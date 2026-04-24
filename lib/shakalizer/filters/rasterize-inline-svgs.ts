import sharp from "sharp";
import type { DomFilter } from "@/lib/shakalizer/types";

const MIN_RASTER_SIDE = 32;
const MAX_RASTER_SIDE = 180;
const MAX_OUTPUT_SIDE = 260;
const SCALE_FACTOR = 0.26;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseSvgDimension(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.includes("%")) {
    return null;
  }

  const parsed = Number.parseFloat(trimmed);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function inferSvgDimensions(markup: string) {
  const widthMatch = markup.match(/\bwidth="([^"]+)"/i)?.[1];
  const heightMatch = markup.match(/\bheight="([^"]+)"/i)?.[1];
  const viewBoxMatch = markup.match(/\bviewBox="([^"]+)"/i)?.[1];
  const width = parseSvgDimension(widthMatch);
  const height = parseSvgDimension(heightMatch);

  if (width !== null && height !== null) {
    return { width, height };
  }

  if (viewBoxMatch) {
    const parts = viewBoxMatch
      .trim()
      .split(/[\s,]+/)
      .map((part) => Number.parseFloat(part));

    if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
      return {
        width: clamp(parts[2] || 160, 24, 512),
        height: clamp(parts[3] || 160, 24, 512),
      };
    }
  }

  return {
    width: width ?? 160,
    height: height ?? 160,
  };
}

function ensureSvgNamespace(markup: string) {
  if (/\bxmlns=/.test(markup)) {
    return markup;
  }

  return markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
}

function toDataUriPng(buffer: Buffer) {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function rasterizeSvgMarkup(markup: string): Promise<Buffer> {
  const normalizedMarkup = ensureSvgNamespace(markup);
  const { width, height } = inferSvgDimensions(normalizedMarkup);
  const lowWidth = clamp(
    Math.round(width * SCALE_FACTOR),
    MIN_RASTER_SIDE,
    MAX_RASTER_SIDE,
  );
  const lowHeight = clamp(
    Math.round(height * SCALE_FACTOR),
    MIN_RASTER_SIDE,
    MAX_RASTER_SIDE,
  );
  const outputScale = Math.min(MAX_OUTPUT_SIDE / width, MAX_OUTPUT_SIDE / height, 1);
  const outputWidth = Math.max(Math.round(width * outputScale), 1);
  const outputHeight = Math.max(Math.round(height * outputScale), 1);

  return sharp(Buffer.from(normalizedMarkup), {
    density: 96,
  })
    .resize({
      width: lowWidth,
      height: lowHeight,
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.nearest,
    })
    .resize({
      width: outputWidth,
      height: outputHeight,
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.nearest,
    })
    .png({
      compressionLevel: 9,
      palette: true,
      quality: 35,
      effort: 10,
    })
    .toBuffer();
}

export const rasterizeInlineSvgElements: DomFilter = async ($) => {
  const svgElements = $("svg").toArray();

  for (const element of svgElements) {
    const svg = $(element);
    const markup = $.html(svg);

    if (!markup.trim()) {
      continue;
    }

    try {
      const rasterBuffer = await rasterizeSvgMarkup(markup);
      const { width, height } = inferSvgDimensions(markup);
      const alt =
        svg.attr("aria-label") ??
        svg.attr("title") ??
        svg.attr("name") ??
        "Rasterized SVG";

      svg.replaceWith(`
        <img
          src="${toDataUriPng(rasterBuffer)}"
          alt="${escapeHtmlAttribute(alt)}"
          class="retro-inline-svg-raster"
          width="${Math.min(Math.round(width), MAX_OUTPUT_SIDE)}"
          height="${Math.min(Math.round(height), MAX_OUTPUT_SIDE)}"
        >
      `);
    } catch {
      svg.addClass("retro-tamed-svg");
    }
  }
};
