export const TRUSTED_DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

export const RETRO_BACKGROUND_GIF =
  "https://gifburg.com/images/gifs/stars/gifs/0014.gif";

export const RETRO_CURSOR_URL =
  "http://www.rw-designer.com/cursor-view/21545.png";

export const PAGE_DELAY_RANGE_MS = {
  min: 900,
  max: 1900,
} as const;

export const IMAGE_DELAY_RANGE_MS = {
  min: 2600,
  max: 12000,
} as const;

export const HTML_FETCH_TIMEOUT_MS = 10_000;
export const IMAGE_FETCH_TIMEOUT_MS = 12_000;

export const MAX_HTML_BYTES = 2_500_000;
export const MAX_IMAGE_BYTES = 6_000_000;

export const SHAKAL_PAGE_CACHE_TTL_MS = 5 * 60_000;
export const SHAKAL_PAGE_CACHE_MAX_ENTRIES = 120;

export const SHAKAL_IMAGE_CACHE_TTL_MS = 30 * 60_000;
export const SHAKAL_IMAGE_CACHE_MAX_ENTRIES = 72;
export const SHAKAL_IMAGE_CACHE_MAX_TOTAL_BYTES = 64 * 1024 * 1024;

export const HTML_FETCH_CONCURRENCY = 8;
export const IMAGE_PROCESSING_CONCURRENCY = 2;

export const IMAGE_STREAM_CHUNK_BYTES = 1024;
export const IMAGE_STREAM_CHUNK_DELAY_RANGE_MS = {
  min: 80,
  max: 280,
} as const;
