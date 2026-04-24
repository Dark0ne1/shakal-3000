export type LocalRetroDividerDefinition = {
  alt: string;
  filename: string;
  sourceUrl: string;
};

export const LOCAL_RETRO_DIVIDER_SOURCE =
  "https://www.picgifs.com/divider/";

const LOCAL_RETRO_DIVIDER_DEFINITIONS: LocalRetroDividerDefinition[] = [
  {
    alt: "Stars divider 231798",
    filename: "lines-stars-231798.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/stars/lines-stars-231798.gif",
  },
  {
    alt: "Stars divider 597987",
    filename: "lines-stars-597987.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/stars/lines-stars-597987.gif",
  },
  {
    alt: "Multi color divider 058765",
    filename: "lines-multi-color-058765.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/multi-color/lines-multi-color-058765.gif",
  },
  {
    alt: "Multi color divider 084799",
    filename: "lines-multi-color-084799.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/multi-color/lines-multi-color-084799.gif",
  },
  {
    alt: "Multi color divider 217142",
    filename: "lines-multi-color-217142.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/multi-color/lines-multi-color-217142.gif",
  },
  {
    alt: "Fantasy divider 099621",
    filename: "lines-fantasy-099621.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/fantasy/lines-fantasy-099621.gif",
  },
  {
    alt: "Fantasy divider 309892",
    filename: "lines-fantasy-309892.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/fantasy/lines-fantasy-309892.gif",
  },
  {
    alt: "Fantasy divider 479732",
    filename: "lines-fantasy-479732.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/fantasy/lines-fantasy-479732.gif",
  },
  {
    alt: "Glitter divider 328651",
    filename: "lines-glitter-328651.gif",
    sourceUrl:
      "https://www.picgifs.com/divider/lines/glitter/lines-glitter-328651.gif",
  },
];

export function getLocalRetroDividerPack(appOrigin: URL) {
  return LOCAL_RETRO_DIVIDER_DEFINITIONS.map((divider) => ({
    alt: divider.alt,
    src: new URL(`/retro-dividers/picgifs/${divider.filename}`, appOrigin).toString(),
    sourceUrl: divider.sourceUrl,
  }));
}
