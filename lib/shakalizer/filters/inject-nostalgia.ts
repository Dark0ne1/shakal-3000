import {
  RETRO_BACKGROUND_GIF,
  RETRO_CURSOR_URL,
} from "@/lib/shakalizer/constants";
import { getLocalRetroBannerPack } from "@/lib/shakalizer/local-retro-banners";
import { getLocalRetroDividerPack } from "@/lib/shakalizer/local-retro-dividers";
import { getRetroThemeForUrl } from "@/lib/shakalizer/retro-presets";
import type { DomFilter, ShakalizeContext } from "@/lib/shakalizer/types";
import { shouldApply, stableIntInRangeFromString } from "@/lib/shakalizer/utils";

type RetroBannerDefinition = {
  alt: string;
  src: string;
};

type PopupVariant = {
  alt: string;
  ctaLabel: string;
  searchQuery: string;
  src: string;
};

function ensureHead($: Parameters<DomFilter>[0]) {
  if ($("head").length === 0) {
    $("html").prepend("<head></head>");
  }

  return $("head");
}

function ensureBody($: Parameters<DomFilter>[0]) {
  if ($("body").length === 0) {
    $("html").append("<body></body>");
  }

  return $("body");
}

function createDataUriSvg(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createRetroBadgeDataUri(
  label: string,
  background: string,
  foreground: string,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" viewBox="0 0 88 31">
      <rect width="88" height="31" fill="${background}" stroke="#ffffff" stroke-width="2" />
      <rect x="3" y="3" width="82" height="25" fill="#000000" stroke="${foreground}" stroke-width="1" />
      <text x="44" y="13" text-anchor="middle" font-family="Verdana" font-size="8" fill="${foreground}">WEB 1.0</text>
      <text x="44" y="23" text-anchor="middle" font-family="Verdana" font-size="7" fill="#ffffff">${label}</text>
    </svg>
  `.trim();

  return createDataUriSvg(svg);
}

function createPopupBannerDataUri(
  eyebrow: string,
  headline: string,
  subhead: string,
  accent: string,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">
      <rect width="320" height="120" fill="#ff00ff" stroke="#ffff00" stroke-width="8" />
      <rect x="10" y="10" width="300" height="100" fill="#000066" stroke="#00ffff" stroke-width="4" />
      <text x="160" y="32" text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-size="19" fill="#ffff00">${eyebrow}</text>
      <text x="160" y="67" text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-size="26" fill="${accent}">${headline}</text>
      <text x="160" y="95" text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-size="20" fill="#ff3300">${subhead}</text>
    </svg>
  `.trim();

  return createDataUriSvg(svg);
}

function createVisitorCounterDataUri(seed: string) {
  const visitCount = stableIntInRangeFromString(seed, 104237, 998731);
  const formattedCount = visitCount
    .toString()
    .padStart(6, "0")
    .split("")
    .join(" ");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="36" viewBox="0 0 220 36">
      <rect width="220" height="36" fill="#c0c0c0" stroke="#000000" stroke-width="2" />
      <rect x="4" y="4" width="212" height="28" fill="#000000" stroke="#ffffff" stroke-width="1" />
      <text x="12" y="17" font-family="Verdana, Arial, sans-serif" font-size="9" fill="#ffff00">VISITOR COUNTER</text>
      <text x="110" y="28" text-anchor="middle" font-family="Courier New, monospace" font-size="18" fill="#00ff00">${formattedCount}</text>
    </svg>
  `.trim();

  return createDataUriSvg(svg);
}

function parseSvgDimension(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.includes("%")) {
    return null;
  }

  const parsed = Number.parseFloat(trimmed);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

const POPUP_VARIANTS: PopupVariant[] = [
  {
    alt: "You are the one millionth visitor",
    ctaLabel: "CLAIM MIRACLE PRIZE",
    searchQuery: "you are the 1,000,000th visitor prize",
    src: createPopupBannerDataUri(
      "YOU ARE THE",
      "1,000,000th",
      "VISITOR!!!",
      "#00ff00",
    ),
  },
  {
    alt: "Prince inheritance alert",
    ctaLabel: "SEND BANK DETAILS",
    searchQuery: "nigerian prince inheritance email",
    src: createPopupBannerDataUri(
      "CONGRATULATIONS",
      "NIGERIAN PRINCE",
      "LEFT YOU FORTUNE",
      "#00ffcc",
    ),
  },
  {
    alt: "Free vacation winner notice",
    ctaLabel: "GET FREE VACATION",
    searchQuery: "free vacation winner popup",
    src: createPopupBannerDataUri(
      "YOU JUST WON",
      "FREE BAHAMAS",
      "CLICK TO ESCAPE",
      "#66ff33",
    ),
  },
  {
    alt: "System infected warning",
    ctaLabel: "SCAN COMPUTER NOW",
    searchQuery: "your computer is infected popup",
    src: createPopupBannerDataUri(
      "WARNING!!!",
      "12 VIRUSES FOUND",
      "ACT IMMEDIATELY",
      "#ff5555",
    ),
  },
  {
    alt: "Secret admirer reward banner",
    ctaLabel: "OPEN LOVE MESSAGE",
    searchQuery: "secret admirer prize popup",
    src: createPopupBannerDataUri(
      "SPECIAL MESSAGE",
      "MYSTERY ADMIRER",
      "SENT YOU CASH",
      "#ffcc00",
    ),
  },
];

function pickDivider(context: ShakalizeContext) {
  const dividers = getLocalRetroDividerPack(context.appOrigin);
  const index = Math.floor(context.random() * dividers.length);

  return dividers[index] ?? dividers[0];
}

function renderDividerMarkup(context: ShakalizeContext) {
  if (context.mode === "corporate") {
    return '<hr class="retro-divider retro-divider-corporate" aria-hidden="true">';
  }

  const divider = pickDivider(context);

  return `<img class="retro-divider retro-divider-image" src="${divider.src}" width="100%" alt="${divider.alt}">`;
}

function pickBannerSet(
  context: ShakalizeContext,
  minCount = 5,
  maxCount = 10,
): RetroBannerDefinition[] {
  const count =
    minCount +
    Math.floor(context.random() * (maxCount - minCount + 1));
  const available = [...getLocalRetroBannerPack(context.appOrigin)];
  const selected: RetroBannerDefinition[] = [];

  while (selected.length < count && available.length > 0) {
    const index = Math.floor(context.random() * available.length);
    const [banner] = available.splice(index, 1);

    if (banner) {
      selected.push(banner);
    }
  }

  return selected;
}

function renderBannerColumn(
  banners: RetroBannerDefinition[],
  side: "left" | "right",
) {
  const markup = banners
    .map(
      (banner) =>
        `<img src="${banner.src}" alt="${banner.alt}" width="100%" border="2"><br>`,
    )
    .join("");

  return `
    <td class="pain-rail pain-rail-${side}" width="140" valign="top">
      <div class="pain-rail-inner">
        ${markup}
      </div>
    </td>
  `;
}

function buildRetroFooterMarkup(context: ShakalizeContext) {
  const badges = [
    {
      alt: "Best viewed in Netscape",
      src: createRetroBadgeDataUri("NETSCAPE OK", "#0033cc", "#ffff00"),
    },
    {
      alt: "100 percent pure HTML",
      src: createRetroBadgeDataUri("PURE HTML", "#009933", "#ffffff"),
    },
    {
      alt: "Under Construction",
      src: createRetroBadgeDataUri("UNDER CONSTR.", "#cc0000", "#ffff00"),
    },
    {
      alt: "No CSS required",
      src: createRetroBadgeDataUri("NO CSS", "#6600cc", "#00ffff"),
    },
  ];

  const badgeMarkup = badges
    .map(
      (badge) =>
        `<img src="${badge.src}" width="88" height="31" alt="${badge.alt}" border="0">`,
    )
    .join("\n");

  return `
    <center>
      <p><b>VISITOR SURVEILLANCE ZONE</b></p>
      <img
        src="${createVisitorCounterDataUri(context.finalUrl.toString())}"
        width="220"
        height="36"
        border="0"
        alt="Visitor Counter"
      >
      <p>
        ${badgeMarkup}
      </p>
    </center>
  `;
}

function buildDialUpOverlayMarkup(delayMs: number) {
  return `
    <div class="dialup-overlay">
      <table border="4" cellpadding="8" cellspacing="0" bgcolor="#000080" bordercolor="#c0c0c0">
        <tr>
          <td align="center">
            <font color="#ffff00" size="6"><b>CONNECTING TO THE INFORMATION SUPERHIGHWAY</b></font><br>
            <font color="#00ff00" size="4">Handshaking modem at 33.6 kbps...</font><br>
            <font color="#ffffff" size="3">Estimated wait: ${Math.ceil(delayMs / 1000)} sec</font><br><br>
            <marquee behavior="alternate" scrollamount="8" width="80%">PLEASE WAIT WHILE IMAGES CRAWL IN VERY SLOWLY...</marquee>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function getDialUpOverlayDelay(context: ShakalizeContext): number {
  return Math.min(
    2600,
    stableIntInRangeFromString(
      context.finalUrl.toString(),
      1100,
      2200,
    ),
  );
}

export const injectRetroStyleBlock: DomFilter = ($, context) => {
  const head = ensureHead($);
  const baseHref = context.finalUrl.toString();
  const dialUpDelayMs = getDialUpOverlayDelay(context);
  const popupVariantsJson = JSON.stringify(POPUP_VARIANTS);
  const theme = getRetroThemeForUrl(context.finalUrl, context.mode);

  head.prepend(`<base href="${baseHref}">`);
  head.append(`
    <style>
      @keyframes retro-blink {
        0%, 49% { visibility: visible; }
        50%, 100% { visibility: hidden; }
      }

      html, body, body * {
        font-family: ${theme.bodyFontStack} !important;
      }

      h1, h2, h3, marquee, big, .pain-popup-note, .pain-popup-close, .pain-popup-claim {
        font-family: ${theme.displayFontStack} !important;
      }

      code, pre, tt, kbd, samp, .retro-midi-widget, .dialup-overlay, .retro-broken-image {
        font-family: ${theme.monoFontStack} !important;
      }

      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
      }

      body {
        color: ${theme.bodyText} !important;
        background-color: ${theme.bodyBackground} !important;
        background-image: ${theme.backgroundImageCss} !important;
        background-repeat: repeat !important;
        background-position: top left !important;
        cursor: url('${RETRO_CURSOR_URL}'), auto !important;
        text-shadow: 1px 1px 0 ${theme.bodyTextShadow} !important;
      }

      body.dialup-mode {
        overflow: hidden !important;
      }

      body.dialup-mode > *:not(.dialup-overlay) {
        visibility: hidden !important;
      }

      img, video, canvas, svg, iframe {
        max-width: 100% !important;
      }

      .retro-scan-frame {
        position: relative !important;
        display: inline-block !important;
        max-width: 100% !important;
        overflow: hidden !important;
        background: #000000 !important;
        line-height: 0 !important;
        vertical-align: top !important;
        --scan-progress: 0% !important;
        --scan-cover: 100% !important;
      }

      .retro-scan-frame.retro-scan-fluid {
        display: block !important;
        width: 100% !important;
      }

      .retro-scan-frame::before {
        content: "" !important;
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        height: var(--scan-cover) !important;
        background:
          repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03) 0 2px,
            rgba(0, 0, 0, 0.1) 2px 4px
          ),
          linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.75) 100%) !important;
        opacity: 1 !important;
        pointer-events: none !important;
      }

      .retro-scan-frame.is-loaded::before {
        background:
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.04) 2px,
            rgba(0, 0, 0, 0.04) 4px
          ) !important;
        height: 100% !important;
        opacity: 1 !important;
      }

      .retro-scan-frame::after {
        content: "" !important;
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: calc(var(--scan-progress) - 10px) !important;
        height: 14px !important;
        background:
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(0, 255, 255, 0.85) 50%,
            rgba(255, 255, 255, 0) 100%
          ) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      .retro-scan-frame.is-loading::after {
        opacity: 1 !important;
      }

      .retro-scan-frame.is-loaded::before,
      .retro-scan-frame.is-loaded::after {
        opacity: 0 !important;
      }

      .retro-scan-frame.is-error::before {
        background:
          repeating-linear-gradient(
            45deg,
            rgba(120, 0, 0, 0.7) 0 12px,
            rgba(30, 0, 0, 0.85) 12px 24px
          ) !important;
        opacity: 1 !important;
      }

      .retro-scan-image {
        display: block !important;
        image-rendering: pixelated !important;
      }

      .retro-broken-image {
        display: inline-block !important;
        max-width: min(220px, 100%) !important;
        max-height: 160px !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        background: #c0c0c0 !important;
        image-rendering: pixelated !important;
      }

      .retro-inline-svg-raster {
        display: inline-block !important;
        max-width: min(260px, 100%) !important;
        max-height: 220px !important;
        width: auto !important;
        height: auto !important;
        image-rendering: pixelated !important;
        vertical-align: top !important;
      }

      .retro-tamed-svg {
        display: inline-block !important;
        width: auto !important;
        height: auto !important;
        max-width: min(320px, 100%) !important;
        max-height: 220px !important;
        overflow: hidden !important;
        vertical-align: top !important;
      }

      a:link {
        color: ${theme.linkColor} !important;
        text-decoration: underline !important;
      }

      a:visited {
        color: ${theme.visitedColor} !important;
      }

      table, td, th {
        border: 1px solid ${theme.tableBorder} !important;
      }

      .retro-blink {
        animation: retro-blink 0.9s steps(1, end) infinite;
      }

      .pain-frame {
        width: 100% !important;
        height: 100% !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        max-width: 100% !important;
      }

      .pain-rail {
        width: 140px !important;
        min-width: 140px !important;
        vertical-align: top !important;
        background: ${theme.railBackground} !important;
        overflow: hidden !important;
      }

      .pain-rail-inner {
        position: sticky !important;
        top: 0 !important;
        vertical-align: top !important;
        padding: 4px !important;
      }

      .pain-center {
        width: auto !important;
        min-width: 0 !important;
        vertical-align: top !important;
        background: ${theme.centerBackground} !important;
        padding: 0 10px !important;
        overflow-x: auto !important;
        word-break: break-word !important;
      }

      .pain-center > * {
        max-width: 100% !important;
      }

      .pain-center table {
        max-width: 100% !important;
      }

      .pain-center img,
      .pain-center video,
      .pain-center canvas,
      .pain-center svg,
      .pain-center iframe {
        height: auto !important;
      }

      .retro-divider-image {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        max-height: 26px !important;
        height: 26px !important;
        margin: 8px 0 !important;
        object-fit: cover !important;
        overflow: hidden !important;
      }

      .retro-divider-corporate {
        display: block !important;
        width: 100% !important;
        height: 0 !important;
        margin: 10px 0 !important;
        border: 0 !important;
        border-top: 1px solid #7f8ca3 !important;
        border-bottom: 1px solid #ffffff !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .pain-popup {
        position: fixed !important;
        top: 88px !important;
        right: 16px !important;
        z-index: 99999 !important;
        width: min(330px, 32vw) !important;
        max-width: calc(100vw - 32px) !important;
        padding: 8px !important;
        background: ${theme.popupBackground} !important;
        border: 5px ridge ${theme.popupBorder} !important;
        box-shadow: 8px 8px 0 ${theme.popupShadow} !important;
        transition:
          top 0.2s steps(2, end),
          right 0.2s steps(2, end),
          bottom 0.2s steps(2, end),
          left 0.2s steps(2, end),
          transform 0.18s steps(2, end) !important;
      }

      .pain-popup img {
        display: block !important;
        width: 100% !important;
      }

      .pain-popup-close {
        display: inline-block !important;
        margin-top: 6px !important;
        padding: 4px 8px !important;
        background: #ff0000 !important;
        color: #ffffff !important;
        font-weight: bold !important;
        text-decoration: none !important;
        border: 3px outset #cccccc !important;
      }

      .pain-popup-claim {
        display: inline-block !important;
        margin-top: 6px !important;
        margin-right: 6px !important;
        padding: 4px 8px !important;
        background: #000080 !important;
        color: #ffffff !important;
        font-weight: bold !important;
        text-decoration: none !important;
        border: 3px outset #cccccc !important;
      }

      .pain-popup-note {
        display: block !important;
        margin-top: 5px !important;
        color: #000080 !important;
        font-size: 14px !important;
        font-weight: bold !important;
      }

      .pain-popup.is-jumping {
        transform: rotate(-4deg) scale(1.03) !important;
      }

      .retro-midi-widget {
        margin: 8px auto !important;
        padding: 6px 10px !important;
        width: fit-content !important;
        background: ${theme.midiBackground} !important;
        color: ${theme.midiText} !important;
        border: 3px ridge #c0c0c0 !important;
        font-weight: bold !important;
      }

      .dialup-overlay {
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 24px !important;
        background:
          repeating-linear-gradient(
            45deg,
            ${theme.overlayAccentA} 0 20px,
            ${theme.overlayAccentB} 20px 40px
          ),
          rgba(0, 0, 0, 0.9) !important;
      }

      .dialup-overlay table,
      .dialup-overlay td {
        border-color: #00ffff !important;
      }

      @media (max-width: 1100px) {
        .pain-rail {
          width: 120px !important;
          min-width: 120px !important;
        }

        .pain-popup {
          width: min(280px, 38vw) !important;
        }
      }

      @media (max-width: 860px) {
        .pain-rail {
          display: none !important;
        }

        .pain-center {
          padding: 0 4px !important;
        }

        .pain-popup {
          position: static !important;
          width: min(330px, calc(100vw - 24px)) !important;
          margin: 12px auto !important;
        }
      }
    </style>
	    <script>
	      window.addEventListener('DOMContentLoaded', function () {
	        var popupVariants = ${popupVariantsJson};
	        var body = document.body;
	        if (!body) {
	          return;
	        }

          if (body.classList.contains('dialup-mode')) {
	          window.setTimeout(function () {
	            body.classList.remove('dialup-mode');
	            var overlay = document.querySelector('.dialup-overlay');
	            if (overlay && overlay.parentNode) {
	              overlay.parentNode.removeChild(overlay);
	            }
	          }, ${dialUpDelayMs});
          }

          function clampPopupOffset(value, limit) {
            if (value < 0) {
              return 0;
            }

            if (value > limit) {
              return limit;
            }

            return value;
          }

          function positionPopup(popup, slotIndex) {
            if (!popup) {
              return;
            }

            var slots = [
              { top: '88px', right: '16px', left: 'auto', bottom: 'auto' },
              { top: '132px', left: '18px', right: 'auto', bottom: 'auto' },
              { bottom: '26px', right: '24px', top: 'auto', left: 'auto' },
              { bottom: '34px', left: '28px', top: 'auto', right: 'auto' },
              { top: '28%', right: '10%', left: 'auto', bottom: 'auto' },
              { top: '42%', left: '12%', right: 'auto', bottom: 'auto' }
            ];
            var slot = slots[slotIndex % slots.length];

            popup.style.top = slot.top || 'auto';
            popup.style.right = slot.right || 'auto';
            popup.style.bottom = slot.bottom || 'auto';
            popup.style.left = slot.left || 'auto';

            if (window.innerWidth <= 860) {
              popup.style.top = 'auto';
              popup.style.right = 'auto';
              popup.style.bottom = 'auto';
              popup.style.left = 'auto';
            }
          }

          function updatePopupVariant(popup, variantIndex) {
            if (!popup || !popupVariants.length) {
              return;
            }

            var variant = popupVariants[variantIndex % popupVariants.length];
            var image = popup.querySelector('img');
            var note = popup.querySelector('.pain-popup-note');
            var closeLink = popup.querySelector('.pain-popup-close');
            var claimLink = popup.querySelector('.pain-popup-claim');

            if (image) {
              image.setAttribute('src', variant.src);
              image.setAttribute('alt', variant.alt);
            }

            if (note) {
              note.textContent = variant.alt.toUpperCase() + '!!!';
            }

            if (closeLink) {
              closeLink.textContent = 'CLOSE THIS AMAZING BANNER';
            }

            if (claimLink) {
              claimLink.setAttribute(
                'href',
                'https://www.google.com/search?q=' + encodeURIComponent(variant.searchQuery)
              );
              claimLink.textContent = variant.ctaLabel;
            }
          }

          function initPainPopup() {
            var popup = document.querySelector('.pain-popup');
            if (!popup || popup.dataset.popupBound === '1' || !popupVariants.length) {
              return;
            }

            popup.dataset.popupBound = '1';

            var currentIndex = parseInt(popup.getAttribute('data-popup-index') || '0', 10) || 0;
            var currentSlot = parseInt(popup.getAttribute('data-popup-slot') || '0', 10) || 0;
            var closeLink = popup.querySelector('.pain-popup-close');
            var claimLink = popup.querySelector('.pain-popup-claim');

            updatePopupVariant(popup, currentIndex);
            positionPopup(popup, currentSlot);

            function jumpPopup() {
              currentIndex = (currentIndex + 1 + Math.floor(Math.random() * (popupVariants.length - 1 || 1))) % popupVariants.length;
              currentSlot = (currentSlot + 1 + Math.floor(Math.random() * 3)) % 6;
              popup.setAttribute('data-popup-index', String(currentIndex));
              popup.setAttribute('data-popup-slot', String(currentSlot));
              updatePopupVariant(popup, currentIndex);
              positionPopup(popup, currentSlot);
              popup.classList.add('is-jumping');

              window.setTimeout(function () {
                popup.classList.remove('is-jumping');
              }, 280);
            }

            if (closeLink) {
              closeLink.addEventListener('click', function (event) {
                event.preventDefault();
                jumpPopup();
              });
            }

            if (claimLink) {
              claimLink.addEventListener('mouseenter', function () {
                if (window.innerWidth <= 860) {
                  return;
                }

                var maxRight = Math.max(window.innerWidth - popup.offsetWidth - 24, 0);
                var maxTop = Math.max(window.innerHeight - popup.offsetHeight - 24, 0);
                popup.style.right = clampPopupOffset(Math.floor(Math.random() * maxRight), maxRight) + 'px';
                popup.style.left = 'auto';
                popup.style.top = clampPopupOffset(Math.floor(Math.random() * maxTop), maxTop) + 'px';
                popup.style.bottom = 'auto';
              });
            }
          }

	        function ensureScanFrame(image) {
          var parent = image.parentElement;
          var frame = null;

          if (parent && parent.classList.contains('retro-scan-frame')) {
            frame = parent;
          } else if (parent && parent.tagName === 'PICTURE') {
            frame = parent;
            frame.classList.add('retro-scan-frame');
          } else if (parent) {
            frame = document.createElement('span');
            frame.className = 'retro-scan-frame';
            parent.insertBefore(frame, image);
            frame.appendChild(image);
          }

          if (!frame) {
            return null;
          }

          var widthAttr = image.getAttribute('width');
          if (widthAttr && widthAttr.indexOf('%') !== -1) {
            frame.classList.add('retro-scan-fluid');
          }

          frame.classList.add('is-waiting');
          frame.style.setProperty('--scan-progress', '0%');
          frame.style.setProperty('--scan-cover', '100%');
          return frame;
        }

        function startScanAnimation(image, frame) {
          if (!frame || frame.dataset.scanStarted === '1') {
            return;
          }

          frame.dataset.scanStarted = '1';
          frame.classList.remove('is-waiting');
          frame.classList.add('is-loading');

          var duration = parseInt(image.getAttribute('data-scan-duration') || '9000', 10);
          var startedAt = null;

          function step(timestamp) {
            if (startedAt === null) {
              startedAt = timestamp;
            }

            var progress = Math.min((timestamp - startedAt) / duration, 1);
            var steppedProgress = Math.round(progress * 100);
            frame.style.setProperty('--scan-progress', steppedProgress + '%');
            frame.style.setProperty('--scan-cover', (100 - steppedProgress) + '%');

            if (progress < 1) {
              window.requestAnimationFrame(step);
              return;
            }

            frame.classList.remove('is-loading');
            frame.classList.add('is-loaded');
            frame.style.setProperty('--scan-progress', '100%');
            frame.style.setProperty('--scan-cover', '0%');
          }

          window.requestAnimationFrame(step);
        }

        function initScanImage(image) {
          if (!image || image.dataset.scanBound === '1') {
            return;
          }

          image.dataset.scanBound = '1';
          var frame = ensureScanFrame(image);

          if (!frame) {
            return;
          }

          window.setTimeout(function () {
            if (frame.classList.contains('is-loaded') || frame.classList.contains('is-error')) {
              return;
            }

            frame.classList.remove('is-loading');
            frame.classList.remove('is-waiting');
            frame.classList.add('is-loaded');
            frame.style.setProperty('--scan-progress', '100%');
            frame.style.setProperty('--scan-cover', '0%');
          }, 26000);

          if (image.complete && image.naturalWidth > 0) {
            startScanAnimation(image, frame);
            return;
          }

          image.addEventListener('load', function () {
            startScanAnimation(image, frame);
          }, { once: true });

          image.addEventListener('error', function () {
            frame.classList.remove('is-loading');
            frame.classList.remove('is-waiting');
            frame.classList.add('is-error');
            frame.style.setProperty('--scan-progress', '100%');
            frame.style.setProperty('--scan-cover', '0%');
          }, { once: true });
        }

	        document.querySelectorAll('img.retro-scan-image').forEach(initScanImage);
          initPainPopup();
	      });
	    </script>
	  `);
};

export const applyAcidBodyTheme: DomFilter = ($) => {
  ensureBody($)
    .attr("style", "background-color: #000000; color: #00FF00;")
    .addClass("dialup-mode");
};

export const addRetroBodyBackground: DomFilter = ($) => {
  ensureBody($).attr("background", RETRO_BACKGROUND_GIF);
};

export const centerBodyContent: DomFilter = ($) => {
  const body = ensureBody($);

  if (body.children("center").length === 1 && body.children().length === 1) {
    return;
  }

  const center = $("<center></center>");
  center.append(body.contents());
  body.append(center);
};

export const addChunkyImageBorders: DomFilter = ($) => {
  $("img").each((_, element) => {
    $(element).attr("border", "5");
  });
};

export const tameInlineSvgElements: DomFilter = ($) => {
  $("svg").each((_, element) => {
    const svg = $(element);
    const width = parseSvgDimension(svg.attr("width"));
    const height = parseSvgDimension(svg.attr("height"));
    const viewBox = svg.attr("viewBox") ?? "";
    const role = (svg.attr("role") ?? "").toLowerCase();
    const ariaLabel = (svg.attr("aria-label") ?? "").toLowerCase();
    const isLikelyIcon =
      !viewBox ||
      viewBox.trim().split(/\s+/).length === 4 ||
      role === "img" ||
      ariaLabel.includes("icon") ||
      ariaLabel.includes("logo");

    if (
      isLikelyIcon &&
      (
        width === null ||
        height === null ||
        width >= 280 ||
        height >= 280
      )
    ) {
      svg.addClass("retro-tamed-svg");
      svg.removeAttr("style");
    }
  });
};

export const marqueeFirstPrimaryHeading: DomFilter = ($) => {
  const firstHeading = $("h1, h2").first();

  if (firstHeading.length === 0) {
    return;
  }

  const headingText = firstHeading.text().trim() || "WELCOME TO MY WEBSITE";
  firstHeading.replaceWith(
    `<marquee scrollamount="20" behavior="alternate" bgcolor="red">${headingText}</marquee>`,
  );
};

export const injectRetroHorizontalRules: DomFilter = ($, context) => {
  $("p").each((_, element) => {
    $(element).after(renderDividerMarkup(context));
  });
};

export const replaceSemanticLayoutsWithTables: DomFilter = ($) => {
  $("nav, header").each((_, element) => {
    const content = $(element).html() ?? "";
    $(element).replaceWith(
      `<table border="3" bordercolor="blue" bgcolor="yellow"><tr><td>${content}</td></tr></table>`,
    );
  });
};

export const injectBackgroundMidi: DomFilter = ($) => {
  const body = ensureBody($);

  body.prepend(`
    <div class="retro-midi-widget">
      MIDI PLAYER: OFFLINE BUT LOOKS IMPORTANT
    </div>
  `);
};

export const injectDialUpOverlay: DomFilter = ($, context) => {
  const body = ensureBody($);
  const delayMs = getDialUpOverlayDelay(context);

  if (body.children(".dialup-overlay").length > 0) {
    return;
  }

  body.prepend(buildDialUpOverlayMarkup(delayMs));
};

export const injectRetroFooterGarbage: DomFilter = ($, context) => {
  const body = ensureBody($);

  body.append(buildRetroFooterMarkup(context));
};

export const wrapBodyInPainFrame: DomFilter = ($, context) => {
  const body = ensureBody($);

  if (body.children("table.pain-frame").length > 0) {
    return;
  }

  const leftBanners = pickBannerSet(context);
  const rightBanners = pickBannerSet(context);
  const contentContainer = $("<div></div>");
  contentContainer.append(body.contents());

  const layoutMarkup = `
    <table class="pain-frame" width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        ${renderBannerColumn(leftBanners, "left")}
        <td class="pain-center" valign="top"></td>
        ${renderBannerColumn(rightBanners, "right")}
      </tr>
    </table>
  `;

  body.append(layoutMarkup);
  body.find("td.pain-center").first().append(contentContainer.contents());
};

export const injectFloatingVisitorPopup: DomFilter = ($, context) => {
  const body = ensureBody($);

  if (body.children("div.pain-popup").length > 0) {
    return;
  }

  const initialIndex = Math.floor(context.random() * POPUP_VARIANTS.length);
  const initialVariant = POPUP_VARIANTS[initialIndex] ?? POPUP_VARIANTS[0];
  const initialSlot = Math.floor(context.random() * 6);

  body.append(`
	    <div class="pain-popup" data-popup-index="${initialIndex}" data-popup-slot="${initialSlot}">
	      <img src="${initialVariant.src}" alt="${initialVariant.alt}" border="4">
        <span class="pain-popup-note">${initialVariant.alt.toUpperCase()}!!!</span>
        <a
          class="pain-popup-claim"
          href="https://www.google.com/search?q=${encodeURIComponent(initialVariant.searchQuery)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${initialVariant.ctaLabel}
        </a>
	      <a
	        class="pain-popup-close"
	        href="#close-this-amazing-banner"
	        target="_blank"
	        rel="noopener noreferrer"
	      >
	        CLOSE THIS AMAZING BANNER
	      </a>
	    </div>
	  `);
};

export const blinkifyImportantText: DomFilter = ($, context) => {
  $("b, strong").each((_, element) => {
    if (!shouldApply(0.35, context.random)) {
      return;
    }

    const existingClass = $(element).attr("class");
    const nextClassName = [existingClass, "retro-blink"].filter(Boolean).join(" ");

    $(element).attr("class", nextClassName);
  });
};
