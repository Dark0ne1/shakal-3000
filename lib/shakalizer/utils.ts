export function normalizeTargetUrl(rawUrl: string): URL {
  const normalized = rawUrl.trim();

  if (!normalized) {
    throw new Error("Пустой URL");
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(normalized)
    ? normalized
    : `https://${normalized}`;

  const parsedUrl = new URL(withProtocol);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Поддерживаются только http и https URL.");
  }

  return parsedUrl;
}

function firstHeaderValue(value: string | null): string | null {
  return value?.split(",")[0]?.trim() || null;
}

export function getPublicAppOrigin(request: Request): URL {
  const fallbackUrl = new URL(request.url);
  const forwardedHost =
    firstHeaderValue(request.headers.get("x-forwarded-host")) ??
    firstHeaderValue(request.headers.get("host")) ??
    fallbackUrl.host;
  const forwardedProto =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) ??
    fallbackUrl.protocol.replace(":", "");

  return new URL(`${forwardedProto}://${forwardedHost}`);
}

export function shouldApply(probability: number, random: () => number): boolean {
  return random() < probability;
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function randomIntInRange(
  min: number,
  max: number,
  random: () => number = Math.random,
): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function hashStringToInt(input: string): number {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function stableIntInRangeFromString(
  input: string,
  min: number,
  max: number,
): number {
  if (max <= min) {
    return min;
  }

  const hash = hashStringToInt(input);
  const range = max - min + 1;

  return min + (hash % range);
}

export async function readResponseBufferWithLimit(
  response: Response,
  maxBytes: number,
): Promise<Buffer> {
  if (!response.body) {
    return Buffer.alloc(0);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    totalBytes += value.byteLength;

    if (totalBytes > maxBytes) {
      throw new Error(`Ответ превысил лимит в ${maxBytes} байт.`);
    }

    chunks.push(value);
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}
