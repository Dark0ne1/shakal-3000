import { NextResponse } from "next/server";
import { buildShakalDocumentUrlFromRaw } from "@/lib/shakalizer/document-route";
import { normalizeDegradationMode } from "@/lib/shakalizer/degradation-mode";
import { getPublicAppOrigin, normalizeTargetUrl } from "@/lib/shakalizer/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ShakalizeRequestBody = {
  url?: string;
  mode?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ShakalizeRequestBody;
    const appOrigin = getPublicAppOrigin(request);

    if (!body.url?.trim()) {
      return NextResponse.json(
        { error: "Нужен URL, иначе деградировать нечего." },
        { status: 400 },
      );
    }

    const normalizedUrl = normalizeTargetUrl(body.url);
    const mode = normalizeDegradationMode(body.mode);

    return NextResponse.json({
      requestedUrl: normalizedUrl.toString(),
      previewUrl: buildShakalDocumentUrlFromRaw(body.url, appOrigin, mode),
      mode,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось подготовить URL для шакализации.",
      },
      { status: 400 },
    );
  }
}
