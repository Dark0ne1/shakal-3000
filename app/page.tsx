import { normalizeDegradationMode } from "@/lib/shakalizer/degradation-mode";
import { ShakalizerForm } from "@/components/ShakalizerForm";

type HomePageProps = {
  searchParams?: Promise<{
    url?: string | string[];
    mode?: string | string[];
  }>;
};

function RetroBanner({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialUrl = Array.isArray(resolvedSearchParams?.url)
    ? resolvedSearchParams?.url[0]
    : resolvedSearchParams?.url;
  const initialMode = normalizeDegradationMode(
    Array.isArray(resolvedSearchParams?.mode)
      ? resolvedSearchParams?.mode[0]
      : resolvedSearchParams?.mode,
  );

  return (
    <main className="home-shell">
      <RetroBanner html="<marquee behavior='alternate' scrollamount='14'>!!! ШАКАЛИЗАТОР САЙТОВ 3000 !!!</marquee>" />
      <RetroBanner html="<marquee direction='right' scrollamount='7'>Лучший сервис по уничтожению современного веба с 1999 года*</marquee>" />

      <section className="hero-panel">
        <h1 className="page-title">Web 1.0 Proxy-Деградатор</h1>
        <p className="hero-copy">
          Вставьте URL современного сайта, нажмите кнопку и получите позорную,
          но душевную ретро-версию с удалёнными стилями, мигающим текстом и
          морально устаревшими решениями.
        </p>

        <table className="feature-table" cellPadding={6} cellSpacing={0}>
          <tbody>
            <tr>
              <td>Статус проекта</td>
              <td>Локальный MVP</td>
            </tr>
            <tr>
              <td>Технологии</td>
              <td>Next.js App Router + Cheerio</td>
            </tr>
            <tr>
              <td>Шаринг</td>
              <td>Работает через `/?url=https://...`</td>
            </tr>
          </tbody>
        </table>
      </section>

      <ShakalizerForm initialUrl={initialUrl} initialMode={initialMode} />

      <section className="disclaimer-box">
        <h2>Важное предупреждение</h2>
        <p>
          Сайты с тяжёлой антибот-защитой, логином, динамическим рендером или
          Cloudflare-щитами могут сопротивляться шакализации. Для первого шага
          это нормально.
        </p>
      </section>
    </main>
  );
}
