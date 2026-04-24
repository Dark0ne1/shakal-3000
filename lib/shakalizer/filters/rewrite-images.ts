import type { Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
import {
  buildShakalImageProxyUrl,
  resolveRemoteAssetUrl,
  rewriteSrcsetThroughProxy,
} from "@/lib/shakalizer/image-proxy";
import {
  createBrokenImagePlaceholderDataUri,
  shouldRenderBrokenImage,
} from "@/lib/shakalizer/retro-presets";
import type { DomFilter } from "@/lib/shakalizer/types";
import { stableIntInRangeFromString } from "@/lib/shakalizer/utils";

function parseDimension(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.includes("%")) {
    return null;
  }

  const parsed = Number.parseInt(trimmedValue, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function isLargeOrCriticalImage(
  image: Cheerio<AnyNode>,
): boolean {
  const width = parseDimension(image.attr("width"));
  const height = parseDimension(image.attr("height"));
  const alt = (image.attr("alt") ?? "").toLowerCase();
  const ariaLabel = (image.attr("aria-label") ?? "").toLowerCase();

  if ((width !== null && width >= 280) || (height !== null && height >= 220)) {
    return true;
  }

  if (width !== null && height !== null && width * height >= 48_000) {
    return true;
  }

  return (
    alt.includes("logo") ||
    alt.includes("google") ||
    ariaLabel.includes("logo") ||
    ariaLabel.includes("google")
  );
}

function getFirstSrcsetUrl(srcset: string): string | null {
  const firstCandidate = srcset.split(",").map((item) => item.trim()).find(Boolean);

  if (!firstCandidate) {
    return null;
  }

  return firstCandidate.split(/\s+/)[0] ?? null;
}

export const rerouteImagesThroughShakalProxy: DomFilter = ($, context) => {
  $("img").each((_, element) => {
    const image = $(element);
    const src = image.attr("src");
    const srcset = image.attr("srcset");
    let proxiedSource: string | null = null;

    if (src) {
      const resolvedSrc = resolveRemoteAssetUrl(src, context.finalUrl);

      if (resolvedSrc) {
        proxiedSource = resolvedSrc.toString();
        image.attr("src", buildShakalImageProxyUrl(resolvedSrc, context.appOrigin));
      }
    }

    if (srcset) {
      const rewrittenSrcset = rewriteSrcsetThroughProxy(
        srcset,
        context.finalUrl,
        context.appOrigin,
      );

      if (rewrittenSrcset) {
        image.attr("srcset", rewrittenSrcset);

        if (!src) {
          const firstProxyUrl = getFirstSrcsetUrl(rewrittenSrcset);

          if (firstProxyUrl) {
            image.attr("src", firstProxyUrl);
          }
        }
      } else {
        image.removeAttr("srcset");
      }
    }

    if (proxiedSource || image.attr("src")?.includes("/api/shakal-image?url=")) {
      const scanSeed = proxiedSource ?? image.attr("src") ?? "";
      const scanDuration = stableIntInRangeFromString(scanSeed, 7000, 16000);
      const shouldBreak =
        shouldRenderBrokenImage(scanSeed, context.mode) &&
        !isLargeOrCriticalImage(image);

      if (shouldBreak) {
        image.attr("src", createBrokenImagePlaceholderDataUri());
        image.removeAttr("srcset");
        image.removeAttr("width");
        image.removeAttr("height");
        image.addClass("retro-broken-image");
        image.attr("data-retro-broken", "1");
        image.attr("alt", "Broken image placeholder");
        return;
      }

      image.addClass("retro-scan-image");
      image.attr("data-scan-duration", `${scanDuration}`);
    }
  });

  $("source[srcset]").each((_, element) => {
    const source = $(element);
    const srcset = source.attr("srcset");

    if (!srcset) {
      return;
    }

    const rewrittenSrcset = rewriteSrcsetThroughProxy(
      srcset,
      context.finalUrl,
      context.appOrigin,
    );

    if (rewrittenSrcset) {
      source.attr("srcset", rewrittenSrcset);
    } else {
      source.remove();
    }
  });
};
