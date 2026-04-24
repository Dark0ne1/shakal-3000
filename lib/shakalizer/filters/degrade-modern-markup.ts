import type { DomFilter } from "@/lib/shakalizer/types";

export const removeModernAssets: DomFilter = ($) => {
  $('link[rel="stylesheet"], style, script').remove();
};

export const stripPresentationalAttributes: DomFilter = ($) => {
  $("*").each((_, element) => {
    $(element).removeAttr("class");
    $(element).removeAttr("style");
  });
};
