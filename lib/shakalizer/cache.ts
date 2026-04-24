import {
  SHAKAL_IMAGE_CACHE_MAX_ENTRIES,
  SHAKAL_IMAGE_CACHE_MAX_TOTAL_BYTES,
  SHAKAL_IMAGE_CACHE_TTL_MS,
  SHAKAL_PAGE_CACHE_MAX_ENTRIES,
  SHAKAL_PAGE_CACHE_TTL_MS,
} from "@/lib/shakalizer/constants";
import type { ShakalizeResult } from "@/lib/shakalizer/types";

type CacheEntry<T> = {
  expiresAt: number;
  size: number;
  value: T;
};

const pageCache = new Map<string, CacheEntry<ShakalizeResult>>();
const pageInflight = new Map<string, Promise<ShakalizeResult>>();

const imageCache = new Map<string, CacheEntry<Buffer>>();
const imageInflight = new Map<string, Promise<Buffer>>();
let imageCacheTotalBytes = 0;

function isExpired(expiresAt: number) {
  return expiresAt <= Date.now();
}

function touchEntry<T>(cache: Map<string, CacheEntry<T>>, key: string, entry: CacheEntry<T>) {
  cache.delete(key);
  cache.set(key, entry);
}

function prunePageCache() {
  for (const [key, entry] of pageCache) {
    if (isExpired(entry.expiresAt)) {
      pageCache.delete(key);
    }
  }

  while (pageCache.size > SHAKAL_PAGE_CACHE_MAX_ENTRIES) {
    const oldestKey = pageCache.keys().next().value;

    if (!oldestKey) {
      break;
    }

    pageCache.delete(oldestKey);
  }
}

function pruneImageCache() {
  for (const [key, entry] of imageCache) {
    if (!isExpired(entry.expiresAt)) {
      continue;
    }

    imageCache.delete(key);
    imageCacheTotalBytes -= entry.size;
  }

  while (
    imageCache.size > SHAKAL_IMAGE_CACHE_MAX_ENTRIES ||
    imageCacheTotalBytes > SHAKAL_IMAGE_CACHE_MAX_TOTAL_BYTES
  ) {
    const oldest = imageCache.entries().next().value;

    if (!oldest) {
      break;
    }

    const [oldestKey, entry] = oldest;
    imageCache.delete(oldestKey);
    imageCacheTotalBytes -= entry.size;
  }
}

export function getCachedShakalPage(key: string): ShakalizeResult | null {
  const entry = pageCache.get(key);

  if (!entry) {
    return null;
  }

  if (isExpired(entry.expiresAt)) {
    pageCache.delete(key);
    return null;
  }

  touchEntry(pageCache, key, entry);
  return entry.value;
}

export function setCachedShakalPage(key: string, value: ShakalizeResult) {
  pageCache.set(key, {
    value,
    size: value.html.length,
    expiresAt: Date.now() + SHAKAL_PAGE_CACHE_TTL_MS,
  });
  prunePageCache();
}

export async function getOrCreateCachedShakalPage(
  key: string,
  factory: () => Promise<ShakalizeResult>,
): Promise<ShakalizeResult> {
  const cached = getCachedShakalPage(key);

  if (cached) {
    return cached;
  }

  const inflight = pageInflight.get(key);

  if (inflight) {
    return inflight;
  }

  const task = factory()
    .then((value) => {
      setCachedShakalPage(key, value);
      return value;
    })
    .finally(() => {
      pageInflight.delete(key);
    });

  pageInflight.set(key, task);
  return task;
}

export function getCachedShakalImage(key: string): Buffer | null {
  const entry = imageCache.get(key);

  if (!entry) {
    return null;
  }

  if (isExpired(entry.expiresAt)) {
    imageCache.delete(key);
    imageCacheTotalBytes -= entry.size;
    return null;
  }

  touchEntry(imageCache, key, entry);
  return entry.value;
}

export function setCachedShakalImage(key: string, value: Buffer) {
  const size = value.byteLength;

  if (size > SHAKAL_IMAGE_CACHE_MAX_TOTAL_BYTES) {
    return;
  }

  const previousEntry = imageCache.get(key);

  if (previousEntry) {
    imageCacheTotalBytes -= previousEntry.size;
  }

  imageCache.set(key, {
    value,
    size,
    expiresAt: Date.now() + SHAKAL_IMAGE_CACHE_TTL_MS,
  });
  imageCacheTotalBytes += size;
  pruneImageCache();
}

export async function getOrCreateCachedShakalImage(
  key: string,
  factory: () => Promise<Buffer>,
): Promise<Buffer> {
  const cached = getCachedShakalImage(key);

  if (cached) {
    return cached;
  }

  const inflight = imageInflight.get(key);

  if (inflight) {
    return inflight;
  }

  const task = factory()
    .then((value) => {
      setCachedShakalImage(key, value);
      return value;
    })
    .finally(() => {
      imageInflight.delete(key);
    });

  imageInflight.set(key, task);
  return task;
}
