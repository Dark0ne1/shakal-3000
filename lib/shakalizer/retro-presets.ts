import type { DegradationMode } from "@/lib/shakalizer/degradation-mode";
import { stableIntInRangeFromString } from "@/lib/shakalizer/utils";

export type RetroTheme = {
  bodyFontStack: string;
  displayFontStack: string;
  monoFontStack: string;
  backgroundImageCss: string;
  bodyBackground: string;
  bodyText: string;
  bodyTextShadow: string;
  linkColor: string;
  visitedColor: string;
  tableBorder: string;
  railBackground: string;
  centerBackground: string;
  popupBackground: string;
  popupBorder: string;
  popupShadow: string;
  midiBackground: string;
  midiText: string;
  overlayAccentA: string;
  overlayAccentB: string;
};

const MODE_THEMES: Record<DegradationMode, RetroTheme[]> = {
  geocities: [
    {
      bodyFontStack: '"Comic Sans MS", "Comic Sans", "Trebuchet MS", cursive',
      displayFontStack: '"Impact", "Arial Black", "Comic Sans MS", sans-serif',
      monoFontStack: '"Courier New", "Lucida Console", monospace',
      backgroundImageCss: "url('https://gifburg.com/images/gifs/stars/gifs/0014.gif')",
      bodyBackground: "#000000",
      bodyText: "#00FF00",
      bodyTextShadow: "#003300",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      tableBorder: "#000000",
      railBackground: "#111111",
      centerBackground: "transparent",
      popupBackground: "#ffff00",
      popupBorder: "#ff00ff",
      popupShadow: "#00ffff",
      midiBackground: "#000080",
      midiText: "#ffff00",
      overlayAccentA: "rgba(255, 255, 0, 0.18)",
      overlayAccentB: "rgba(255, 0, 255, 0.18)",
    },
    {
      bodyFontStack: '"Arial", "Helvetica", sans-serif',
      displayFontStack: '"Comic Sans MS", "Impact", "Arial Black", sans-serif',
      monoFontStack: '"Courier New", "Lucida Console", monospace',
      backgroundImageCss: "url('https://gifburg.com/images/gifs/stars/gifs/0014.gif')",
      bodyBackground: "#201000",
      bodyText: "#ffcc66",
      bodyTextShadow: "#663300",
      linkColor: "#66ccff",
      visitedColor: "#ff99ff",
      tableBorder: "#ff9900",
      railBackground: "#341b00",
      centerBackground: "rgba(255, 245, 220, 0.05)",
      popupBackground: "#ffcc66",
      popupBorder: "#ff3300",
      popupShadow: "#00ffff",
      midiBackground: "#663300",
      midiText: "#ffff99",
      overlayAccentA: "rgba(255, 204, 102, 0.18)",
      overlayAccentB: "rgba(102, 204, 255, 0.18)",
    },
  ],
  hacker: [
    {
      bodyFontStack: '"Courier New", "Lucida Console", monospace',
      displayFontStack: '"Courier New", "Lucida Console", monospace',
      monoFontStack: '"Courier New", "Lucida Console", monospace',
      backgroundImageCss:
        "repeating-linear-gradient(0deg, rgba(0,255,0,0.06) 0 2px, rgba(0,0,0,0.0) 2px 4px)",
      bodyBackground: "#000000",
      bodyText: "#00ff66",
      bodyTextShadow: "#003300",
      linkColor: "#33ff99",
      visitedColor: "#00cc66",
      tableBorder: "#00ff66",
      railBackground: "#001507",
      centerBackground: "rgba(0, 255, 102, 0.03)",
      popupBackground: "#001a0a",
      popupBorder: "#00ff66",
      popupShadow: "#003300",
      midiBackground: "#001507",
      midiText: "#00ff66",
      overlayAccentA: "rgba(0, 255, 102, 0.12)",
      overlayAccentB: "rgba(0, 80, 20, 0.24)",
    },
  ],
  corporate: [
    {
      bodyFontStack: '"Tahoma", "Verdana", "Arial", sans-serif',
      displayFontStack: '"Trebuchet MS", "Arial Black", sans-serif',
      monoFontStack: '"Courier New", "Lucida Console", monospace',
      backgroundImageCss:
        "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.04))",
      bodyBackground: "#d4d8df",
      bodyText: "#002b5c",
      bodyTextShadow: "#ffffff",
      linkColor: "#003399",
      visitedColor: "#5b2b8a",
      tableBorder: "#7f8ca3",
      railBackground: "#bcc5d3",
      centerBackground: "rgba(255, 255, 255, 0.28)",
      popupBackground: "#f0f0f0",
      popupBorder: "#003399",
      popupShadow: "#7f8ca3",
      midiBackground: "#003366",
      midiText: "#ffffff",
      overlayAccentA: "rgba(200, 210, 230, 0.16)",
      overlayAccentB: "rgba(100, 120, 160, 0.18)",
    },
  ],
  princess: [
    {
      bodyFontStack: '"Comic Sans MS", "Comic Sans", "Georgia", cursive',
      displayFontStack: '"Georgia", "Times New Roman", serif',
      monoFontStack: '"Courier New", "Lucida Console", monospace',
      backgroundImageCss:
        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55) 0 12%, transparent 13%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.35) 0 10%, transparent 11%), url('https://gifburg.com/images/gifs/stars/gifs/0014.gif')",
      bodyBackground: "#ffb6d9",
      bodyText: "#8a0055",
      bodyTextShadow: "#fff0fa",
      linkColor: "#cc0099",
      visitedColor: "#7a2fa0",
      tableBorder: "#ff66cc",
      railBackground: "#ffd6ec",
      centerBackground: "rgba(255, 255, 255, 0.32)",
      popupBackground: "#ffe1f3",
      popupBorder: "#ff66cc",
      popupShadow: "#66ffff",
      midiBackground: "#ff66cc",
      midiText: "#ffffff",
      overlayAccentA: "rgba(255, 102, 204, 0.16)",
      overlayAccentB: "rgba(255, 255, 255, 0.18)",
    },
    {
      bodyFontStack: '"Times New Roman", "Georgia", serif',
      displayFontStack: '"Comic Sans MS", "Impact", "Arial Black", sans-serif',
      monoFontStack: '"Courier New", "Lucida Console", monospace',
      backgroundImageCss:
        "radial-gradient(circle at 10% 10%, rgba(255,255,255,0.55) 0 10%, transparent 11%), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.45) 0 8%, transparent 9%)",
      bodyBackground: "#ff99cc",
      bodyText: "#660066",
      bodyTextShadow: "#fff5ff",
      linkColor: "#ff1493",
      visitedColor: "#9932cc",
      tableBorder: "#ff33aa",
      railBackground: "#ffd1ea",
      centerBackground: "rgba(255,255,255,0.3)",
      popupBackground: "#fff0fa",
      popupBorder: "#ff1493",
      popupShadow: "#66ccff",
      midiBackground: "#cc33aa",
      midiText: "#fff8ff",
      overlayAccentA: "rgba(255, 20, 147, 0.12)",
      overlayAccentB: "rgba(255, 255, 255, 0.2)",
    },
  ],
};

function createDataUriSvg(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getRetroThemeForUrl(
  finalUrl: URL,
  mode: DegradationMode,
): RetroTheme {
  const themes = MODE_THEMES[mode];
  const index = stableIntInRangeFromString(
    `${finalUrl.toString()}:${mode}:theme`,
    0,
    themes.length - 1,
  );

  return themes[index] ?? themes[0];
}

export function shouldRenderBrokenImage(
  seed: string,
  mode: DegradationMode,
): boolean {
  const thresholdByMode: Record<DegradationMode, number> = {
    geocities: 17,
    hacker: 11,
    corporate: 6,
    princess: 14,
  };

  return (
    stableIntInRangeFromString(`${seed}:${mode}:broken-image`, 1, 100) <=
    thresholdByMode[mode]
  );
}

export function createBrokenImagePlaceholderDataUri(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
      <rect width="160" height="120" fill="#c0c0c0" stroke="#000000" stroke-width="2" />
      <rect x="7" y="7" width="146" height="106" fill="#ffffff" stroke="#808080" stroke-width="2" />
      <path d="M20 28 h36 l10 10 v36 h-46 z" fill="#f5f5f5" stroke="#000000" stroke-width="2" />
      <path d="M56 28 v10 h10" fill="none" stroke="#000000" stroke-width="2" />
      <path d="M28 74 L58 44" stroke="#ff0000" stroke-width="6" />
      <path d="M58 74 L28 44" stroke="#ff0000" stroke-width="6" />
      <rect x="78" y="28" width="58" height="52" fill="#dfe8ff" stroke="#000080" stroke-width="2" />
      <path d="M86 70 l12-14 l10 8 l10-18 l10 24" fill="none" stroke="#008000" stroke-width="3" />
      <circle cx="97" cy="40" r="5" fill="#ffff00" stroke="#000000" stroke-width="2" />
      <rect x="20" y="90" width="116" height="14" fill="#000080" />
      <text x="78" y="101" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-size="10" fill="#ffffff">The page cannot display the image</text>
    </svg>
  `.trim();

  return createDataUriSvg(svg);
}
