import type { CheerioAPI } from "cheerio";
import type { DegradationMode } from "@/lib/shakalizer/degradation-mode";

export type ShakalizeContext = {
  random: () => number;
  requestedUrl: URL;
  finalUrl: URL;
  appOrigin: URL;
  mode: DegradationMode;
};

export type DomFilter = (
  $: CheerioAPI,
  context: ShakalizeContext,
) => void | Promise<void>;

export type ShakalizeResult = {
  html: string;
  requestedUrl: string;
  finalUrl: string;
};
