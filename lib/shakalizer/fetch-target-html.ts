import {
  HTML_FETCH_TIMEOUT_MS,
  MAX_HTML_BYTES,
  TRUSTED_DESKTOP_USER_AGENT,
} from "@/lib/shakalizer/constants";
import { runHtmlFetchLimited } from "@/lib/shakalizer/limiters";
import { readResponseBufferWithLimit } from "@/lib/shakalizer/utils";

export type FetchedTargetPage = {
  html: string;
  finalUrl: URL;
};

export async function fetchTargetHtml(
  requestedUrl: URL,
): Promise<FetchedTargetPage> {
  return runHtmlFetchLimited(async () => {
    const response = await fetch(requestedUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(HTML_FETCH_TIMEOUT_MS),
      headers: {
        "user-agent": TRUSTED_DESKTOP_USER_AGENT,
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "accept-language": "ru,en-US;q=0.9,en;q=0.8",
        pragma: "no-cache",
        "cache-control": "no-cache",
        "upgrade-insecure-requests": "1",
      },
    });

    if (!response.ok) {
      throw new Error(`Целевая страница вернула HTTP ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error("Целевой URL не вернул HTML-документ.");
    }

    const htmlBuffer = await readResponseBufferWithLimit(response, MAX_HTML_BYTES);

    return {
      html: htmlBuffer.toString("utf-8"),
      finalUrl: new URL(response.url),
    };
  });
}
