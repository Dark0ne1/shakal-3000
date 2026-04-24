import { load } from "cheerio";
import { getOrCreateCachedShakalPage } from "@/lib/shakalizer/cache";
import {
  DEFAULT_DEGRADATION_MODE,
  normalizeDegradationMode,
  type DegradationMode,
} from "@/lib/shakalizer/degradation-mode";
import { fetchTargetHtml } from "@/lib/shakalizer/fetch-target-html";
import {
  removeModernAssets,
  stripPresentationalAttributes,
} from "@/lib/shakalizer/filters/degrade-modern-markup";
import { rasterizeInlineSvgElements } from "@/lib/shakalizer/filters/rasterize-inline-svgs";
import {
  addChunkyImageBorders,
  addRetroBodyBackground,
  applyAcidBodyTheme,
  blinkifyImportantText,
  centerBodyContent,
  injectBackgroundMidi,
  injectDialUpOverlay,
  injectFloatingVisitorPopup,
  injectRetroFooterGarbage,
  injectRetroStyleBlock,
  injectRetroHorizontalRules,
  marqueeFirstPrimaryHeading,
  replaceSemanticLayoutsWithTables,
  tameInlineSvgElements,
  wrapBodyInPainFrame,
} from "@/lib/shakalizer/filters/inject-nostalgia";
import { rerouteImagesThroughShakalProxy } from "@/lib/shakalizer/filters/rewrite-images";
import { rerouteLinksThroughShakalProxy } from "@/lib/shakalizer/filters/rewrite-links";
import type {
  DomFilter,
  ShakalizeContext,
  ShakalizeResult,
} from "@/lib/shakalizer/types";
import { normalizeTargetUrl } from "@/lib/shakalizer/utils";

const degradationFilters: DomFilter[] = [
  removeModernAssets,
  stripPresentationalAttributes,
];

const nostalgiaFilters: DomFilter[] = [
  injectRetroStyleBlock,
  injectDialUpOverlay,
  injectBackgroundMidi,
  applyAcidBodyTheme,
  addRetroBodyBackground,
  replaceSemanticLayoutsWithTables,
  marqueeFirstPrimaryHeading,
  rerouteLinksThroughShakalProxy,
  rerouteImagesThroughShakalProxy,
  rasterizeInlineSvgElements,
  addChunkyImageBorders,
  tameInlineSvgElements,
  injectRetroHorizontalRules,
  centerBodyContent,
  injectRetroFooterGarbage,
  wrapBodyInPainFrame,
  injectFloatingVisitorPopup,
  blinkifyImportantText,
];

export class ShakalizerError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "ShakalizerError";
  }
}

export async function shakalizeUrl(
  rawUrl: string,
  appOrigin: URL,
  random: () => number = Math.random,
  mode: DegradationMode = DEFAULT_DEGRADATION_MODE,
): Promise<ShakalizeResult> {
  let requestedUrl: URL;

  try {
    requestedUrl = normalizeTargetUrl(rawUrl);
  } catch (error) {
    throw new ShakalizerError(
      error instanceof Error ? error.message : "Некорректный URL.",
      400,
    );
  }

  const normalizedMode = normalizeDegradationMode(mode);

  return getOrCreateCachedShakalPage(
    `${requestedUrl.toString()}::${normalizedMode}`,
    async () => {
    const fetchedPage = await fetchTargetHtml(requestedUrl).catch((error) => {
      throw new ShakalizerError(
        error instanceof Error
          ? error.message
          : "Не удалось получить HTML целевой страницы.",
        502,
      );
    });

    const $ = load(fetchedPage.html);
    const context: ShakalizeContext = {
      random,
      requestedUrl,
      finalUrl: fetchedPage.finalUrl,
      appOrigin,
      mode: normalizedMode,
    };

    for (const filter of [...degradationFilters, ...nostalgiaFilters]) {
      await filter($, context);
    }

    return {
      html: $.html(),
      requestedUrl: requestedUrl.toString(),
      finalUrl: fetchedPage.finalUrl.toString(),
    };
    },
  );
}
