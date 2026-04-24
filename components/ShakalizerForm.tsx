"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  DEGRADATION_MODE_OPTIONS,
  DEFAULT_DEGRADATION_MODE,
  getDegradationModeOption,
  normalizeDegradationMode,
  type DegradationMode,
} from "@/lib/shakalizer/degradation-mode";

type ShakalizeResponse = {
  requestedUrl: string;
  previewUrl: string;
  mode: DegradationMode;
};

type ShakalizerFormProps = {
  initialUrl?: string;
  initialMode?: DegradationMode;
};

function isShakalizeResponse(
  payload: ShakalizeResponse | { error: string },
): payload is ShakalizeResponse {
  return "requestedUrl" in payload && "previewUrl" in payload && "mode" in payload;
}

function buildShareableUrl(
  targetUrl: string,
  mode: DegradationMode,
): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const shareUrl = new URL("/", window.location.origin);
  shareUrl.searchParams.set("url", targetUrl);

  if (mode !== DEFAULT_DEGRADATION_MODE) {
    shareUrl.searchParams.set("mode", mode);
  }

  return shareUrl.toString();
}

export function ShakalizerForm({
  initialUrl,
  initialMode = DEFAULT_DEGRADATION_MODE,
}: ShakalizerFormProps) {
  const normalizedInitialMode = normalizeDegradationMode(initialMode);
  const [url, setUrl] = useState(initialUrl ?? "https://example.com");
  const [mode, setMode] = useState<DegradationMode>(normalizedInitialMode);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ShakalizeResponse | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [shareableUrl, setShareableUrl] = useState<string | null>(
    initialUrl ? buildShareableUrl(initialUrl, normalizedInitialMode) : null,
  );
  const hasAutoSubmitted = useRef(false);

  async function submitTargetUrl(nextUrl: string, nextMode: DegradationMode) {
    setIsPending(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/shakalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: nextUrl, mode: nextMode }),
      });

      const payload = (await response.json()) as
        | ShakalizeResponse
        | { error: string };

      if (!response.ok) {
        setResult(null);
        setErrorMessage(
          "error" in payload ? payload.error : "Произошла серверная катастрофа.",
        );
        return;
      }

      if (!isShakalizeResponse(payload)) {
        setResult(null);
        setErrorMessage("Сервер вернул неожиданный ответ.");
        return;
      }

      const nextShareableUrl = buildShareableUrl(payload.requestedUrl, payload.mode);

      if (nextShareableUrl) {
        const historyUrl = new URL(nextShareableUrl);
        window.history.replaceState({}, "", historyUrl);
      }

      setResult(payload);
      setShareableUrl(nextShareableUrl);
      setUrl(payload.requestedUrl);
      setMode(payload.mode);
      setIsFullscreenOpen(false);
    } catch (error) {
      console.error("Shakalize request failed", error);
      setResult(null);
      setErrorMessage(
        "Локальный сервер не ответил. Проверьте, что `next dev` действительно запущен.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitTargetUrl(url, mode);
  }

  useEffect(() => {
    if (!initialUrl?.trim() || hasAutoSubmitted.current) {
      return;
    }

    hasAutoSubmitted.current = true;
    void submitTargetUrl(initialUrl, normalizedInitialMode);
  }, [initialUrl, normalizedInitialMode]);

  const selectedModeOption = getDegradationModeOption(mode);

  return (
    <>
      <section className="shakalizer-panel">
        <h2 className="result-title">Введите жертву</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              className="url-input"
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />

            <button className="retro-button" type="submit" disabled={isPending}>
              {isPending ? "Шакалим..." : "Ошакалить"}
            </button>
          </div>

          <div className="mode-row">
            <label className="mode-picker">
              <span className="mode-label">Режим деградации</span>
              <select
                className="mode-select"
                value={mode}
                onChange={(event) =>
                  setMode(normalizeDegradationMode(event.target.value))
                }
              >
                {DEGRADATION_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="mode-description">{selectedModeOption.description}</p>
          </div>
        </form>

        <p className="hint-copy">
          Совет: если введёте адрес без протокола, сервис автоматически попробует
          добавить <strong>https://</strong>.
        </p>

        {errorMessage ? <p className="error-copy">{errorMessage}</p> : null}

        <p className="status-copy">
          Статус движка:{" "}
          <strong className="blink-soft">
            теперь можно шарить ссылку на корень с параметрами `?url=` и `?mode=`,
            а внутри сайта сохраняется выбранный режим деградации
          </strong>
        </p>

        {result ? (
          <section className="preview-shell">
            <div className="preview-toolbar">
              <div>
                <p className="preview-meta">Исходник: {result.requestedUrl}</p>
                <p className="preview-meta">
                  Режим деградации: {getDegradationModeOption(result.mode).label}
                </p>
                <p className="preview-meta">
                  Навигация внутри iframe тоже сохраняет тот же сценарий порчи
                </p>
                {shareableUrl ? (
                  <p className="preview-meta">
                    Shareable URL: <a href={shareableUrl}>{shareableUrl}</a>
                  </p>
                ) : null}
              </div>

              <button
                className="retro-button fullscreen-button"
                type="button"
                onClick={() => setIsFullscreenOpen(true)}
              >
                На весь экран
              </button>
            </div>

            <iframe
              className="preview-frame"
              title="Результат шакализации"
              src={result.previewUrl}
            />
          </section>
        ) : null}
      </section>

      {result && isFullscreenOpen ? (
        <section
          className="fullscreen-preview"
          aria-label="Полноэкранный просмотр шакализатора"
        >
          <div className="fullscreen-chrome">
            <p className="fullscreen-title">Полноэкранный режим шакализации</p>
            <div className="fullscreen-actions">
              <a
                className="retro-button fullscreen-link"
                href={result.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Новая вкладка
              </a>
              <button
                className="retro-button fullscreen-close"
                type="button"
                onClick={() => setIsFullscreenOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>

          <iframe
            className="fullscreen-frame"
            title="Полноэкранный результат шакализации"
            src={result.previewUrl}
          />
        </section>
      ) : null}
    </>
  );
}
