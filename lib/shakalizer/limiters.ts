import {
  HTML_FETCH_CONCURRENCY,
  IMAGE_PROCESSING_CONCURRENCY,
} from "@/lib/shakalizer/constants";

class AsyncLimiter {
  private activeCount = 0;

  private readonly queue: Array<() => void> = [];

  constructor(private readonly limit: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.activeCount >= this.limit) {
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }

    this.activeCount += 1;

    try {
      return await task();
    } finally {
      this.activeCount -= 1;
      const next = this.queue.shift();

      if (next) {
        next();
      }
    }
  }
}

const htmlFetchLimiter = new AsyncLimiter(HTML_FETCH_CONCURRENCY);
const imageProcessingLimiter = new AsyncLimiter(IMAGE_PROCESSING_CONCURRENCY);

export function runHtmlFetchLimited<T>(task: () => Promise<T>) {
  return htmlFetchLimiter.run(task);
}

export function runImageProcessingLimited<T>(task: () => Promise<T>) {
  return imageProcessingLimiter.run(task);
}
