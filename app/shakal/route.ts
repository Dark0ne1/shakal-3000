import { NextResponse } from "next/server";
import { getCachedShakalPage } from "@/lib/shakalizer/cache";
import { PAGE_DELAY_RANGE_MS } from "@/lib/shakalizer/constants";
import { normalizeDegradationMode } from "@/lib/shakalizer/degradation-mode";
import { ShakalizerError, shakalizeUrl } from "@/lib/shakalizer";
import {
  getPublicAppOrigin,
  normalizeTargetUrl,
  sleep,
  stableIntInRangeFromString,
} from "@/lib/shakalizer/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildErrorHtml(message: string) {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Шакализатор сломался</title>
  </head>
  <body bgcolor="#000000" text="#00FF00">
    <center>
      <h1>Шакализация прервалась</h1>
      <p>${message}</p>
    </center>
  </body>
</html>`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const appOrigin = getPublicAppOrigin(request);
  const rawTargetUrl = requestUrl.searchParams.get("url");
  const mode = normalizeDegradationMode(requestUrl.searchParams.get("mode"));

  if (!rawTargetUrl?.trim()) {
    return new NextResponse(buildErrorHtml("Нужен URL для просмотра."), {
      status: 400,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  try {
    const normalizedTargetUrl = normalizeTargetUrl(rawTargetUrl);
    const cacheKey = `${normalizedTargetUrl.toString()}::${mode}`;
    const cachedResult = getCachedShakalPage(cacheKey);

    if (!cachedResult) {
      const delayMs = stableIntInRangeFromString(
        cacheKey,
        PAGE_DELAY_RANGE_MS.min,
        PAGE_DELAY_RANGE_MS.max,
      );

      await sleep(delayMs);
    }

    const result =
      cachedResult ??
      (await shakalizeUrl(normalizedTargetUrl.toString(), appOrigin, Math.random, mode));

    return new NextResponse(result.html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    const message =
      error instanceof ShakalizerError
        ? error.message
        : "Не удалось открыть шакализированную страницу.";

    return new NextResponse(buildErrorHtml(message), {
      status: error instanceof ShakalizerError ? error.status : 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }
}
