export type LocalRetroBannerDefinition = {
  alt: string;
  filename: string;
  sourceUrl: string;
};

export const LOCAL_RETRO_BANNER_SOURCE =
  "https://cyber.dabamos.de/88x31/";

const LOCAL_RETRO_BANNER_DEFINITIONS: LocalRetroBannerDefinition[] = [
  { alt: "100 hot links", filename: "100hot.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}100hot.gif` },
  { alt: "100 hot links 2", filename: "100hot2.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}100hot2.gif` },
  { alt: "300 free", filename: "300free.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}300free.gif` },
  { alt: "321 free", filename: "321free.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}321free.gif` },
  { alt: "321 webmaster", filename: "321webmaster.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}321webmaster.gif` },
  { alt: "3dfx banner", filename: "3dfx_banner.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}3dfx_banner.gif` },
  { alt: "88 31 chatbox", filename: "88_31_chatbox.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}88_31_chatbox.gif` },
  { alt: "88 31 free downloads", filename: "88_31freedownloads.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}88_31freedownloads.gif` },
  { alt: "88 31 banner", filename: "88-31-banner.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}88-31-banner.gif` },
  { alt: "88x31 visitors", filename: "88x31visitors.ws.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}88x31visitors.ws.gif` },
  { alt: "A browser", filename: "abrowser.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}abrowser.gif` },
  { alt: "Absolutely free", filename: "absfree.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}absfree.gif` },
  { alt: "Adobe get flash", filename: "adobe_getflash2.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}adobe_getflash2.gif` },
  { alt: "Adobe get shockwave", filename: "adobe_get_shockwave.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}adobe_get_shockwave.gif` },
  { alt: "All free", filename: "allfree.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}allfree.gif` },
  { alt: "Altavista", filename: "altavista.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}altavista.gif` },
  { alt: "Amazing free stuff", filename: "amazing_free_stuff.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}amazing_free_stuff.gif` },
  { alt: "Any browser", filename: "any_browser.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}any_browser.gif` },
  { alt: "Banner 123", filename: "banner123.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}banner123.gif` },
  { alt: "Best free", filename: "best_free.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}best_free.gif` },
  { alt: "Button work in progress", filename: "button_wip.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}button_wip.gif` },
  { alt: "Cash clicking", filename: "cashclicking.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}cashclicking.gif` },
  { alt: "CGI guestbook", filename: "cgi-guestbook.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}cgi-guestbook.gif` },
  { alt: "Chatroom", filename: "chatroom.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}chatroom.gif` },
  { alt: "Click here", filename: "click_here.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}click_here.gif` },
  { alt: "Click here red", filename: "clickhere_red.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}clickhere_red.gif` },
  { alt: "Construction", filename: "construction.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}construction.gif` },
  { alt: "Cool archive", filename: "coolarchive.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}coolarchive.gif` },
  { alt: "Counter type 1", filename: "counter_type1.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}counter_type1.gif` },
  { alt: "Crescendo midi", filename: "cresmidi.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}cresmidi.gif` },
  { alt: "Cyberdog", filename: "cyberdog.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}cyberdog.gif` },
  { alt: "Cyber live person", filename: "cyberliveperson.gif", sourceUrl: `${LOCAL_RETRO_BANNER_SOURCE}cyberliveperson.gif` },
];

export function getLocalRetroBannerPack(appOrigin: URL) {
  return LOCAL_RETRO_BANNER_DEFINITIONS.map((banner) => ({
    alt: banner.alt,
    src: new URL(
      `/retro-banners/cyber-dabamos/${banner.filename}`,
      appOrigin,
    ).toString(),
    sourceUrl: banner.sourceUrl,
  }));
}
