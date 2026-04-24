import Link from "next/link";

function RetroBanner({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function NotFound() {
  return (
    <main className="home-shell not-found-shell">
      <RetroBanner html="<marquee behavior='alternate' scrollamount='18'>!!! 404 !!! LOST IN HYPERSPACE !!! 404 !!!</marquee>" />
      <RetroBanner html="<marquee direction='right' scrollamount='9'>ДАННАЯ СТРАНИЦА УЕХАЛА В GEOCITIES, СГОРЕЛА В МОДЕМЕ ИЛИ БЫЛА ПОХИЩЕНА HTML-ГНОМАМИ</marquee>" />

      <section className="hero-panel not-found-panel">
        <p className="not-found-kicker">SYSTEM MESSAGE: FILE NOT FOUND</p>
        <h1 className="page-title">Ошибка 404. Страница жестоко потеряна.</h1>
        <p className="hero-copy">
          Похоже, нужный документ не выдержал шакализации, ушёл в under
          construction или провалился в кротовую нору старого интернета.
        </p>

        <table className="feature-table not-found-table" cellPadding={6} cellSpacing={0}>
          <tbody>
            <tr>
              <td>Код катастрофы</td>
              <td>404 / FILE EVAPORATED</td>
            </tr>
            <tr>
              <td>Вероятная причина</td>
              <td>Ссылка битая, страница удалена или вебмастер всё сломал</td>
            </tr>
            <tr>
              <td>Статус модема</td>
              <td>
                <span className="blink-soft">СВИСТИТ И НЕ ПОМОГАЕТ</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="not-found-actions">
          <Link className="retro-button not-found-button" href="/">
            Вернуться в шакализатор
          </Link>
          <a
            className="retro-button not-found-button"
            href="javascript:history.back()"
          >
            Назад в прошлое
          </a>
        </div>

        <section className="disclaimer-box not-found-box">
          <h2>Что можно сделать дальше</h2>
          <ul className="not-found-list">
            <li>Проверить, не опечатались ли вы в адресе.</li>
            <li>Вернуться на главную и ввести новый URL для унижения.</li>
            <li>Сделать вид, что так и было задумано в 1999 году.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
