import {
  DEFAULT_DEGRADATION_MODE,
  type DegradationMode,
} from "@/lib/shakalizer/degradation-mode";
import { normalizeTargetUrl } from "@/lib/shakalizer/utils";

export function buildShakalDocumentUrl(
  targetUrl: URL,
  appOrigin: URL,
  mode: DegradationMode = DEFAULT_DEGRADATION_MODE,
): string {
  const documentUrl = new URL("/shakal", appOrigin);
  documentUrl.searchParams.set("url", targetUrl.toString());

  if (mode !== DEFAULT_DEGRADATION_MODE) {
    documentUrl.searchParams.set("mode", mode);
  }

  return documentUrl.toString();
}

export function buildShakalDocumentUrlFromRaw(
  rawUrl: string,
  appOrigin: URL,
  mode: DegradationMode = DEFAULT_DEGRADATION_MODE,
): string {
  return buildShakalDocumentUrl(normalizeTargetUrl(rawUrl), appOrigin, mode);
}
