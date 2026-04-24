import { buildShakalDocumentUrl } from "@/lib/shakalizer/document-route";
import { resolveRemoteAssetUrl } from "@/lib/shakalizer/image-proxy";
import type { DomFilter } from "@/lib/shakalizer/types";

export const rerouteLinksThroughShakalProxy: DomFilter = ($, context) => {
  $("a[href], area[href]").each((_, element) => {
    const node = $(element);
    const href = node.attr("href");

    if (!href) {
      return;
    }

    const resolvedUrl = resolveRemoteAssetUrl(href, context.finalUrl);

    if (!resolvedUrl) {
      return;
    }

    node.attr(
      "href",
      buildShakalDocumentUrl(resolvedUrl, context.appOrigin, context.mode),
    );
    node.removeAttr("target");
  });
};
