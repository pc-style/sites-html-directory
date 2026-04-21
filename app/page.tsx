import { notFound } from "next/navigation";
import { getLatestSiteFile, getSiteFiles, getSiteHtml, isValidSiteFileName } from "@/lib/sites";

type PageProps = {
  searchParams?: Promise<{
    file?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const files = await getSiteFiles();
  if (params?.file && !isValidSiteFileName(params.file)) {
    notFound();
  }

  const selectedName = params?.file && isValidSiteFileName(params.file) ? params.file : null;
  const fallback = selectedName ?? (await getLatestSiteFile())?.name ?? null;
  const selected = fallback ? files.find((file) => file.name === fallback) ?? null : null;
  const html = selected ? await getSiteHtml(selected.name) : null;

  if (selectedName && !selected) {
    notFound();
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Sites archive</p>
          <h1 className="title">HTML files from `sites/`</h1>
          <p className="subtitle">
            Browse every `{".html"}` file that matches `YYYY-MM-DD_HH-MM.html`, open one inline, or jump
            straight to the newest file at `/recent`.
          </p>
        </div>
        <div className="badge">{files.length} file{files.length === 1 ? "" : "s"} indexed</div>
      </section>

      <section className="layout">
        <aside className="panel sidebar">
          <h2>Directory</h2>
          {files.length === 0 ? (
            <div className="small-note">Add HTML files to `sites/` and refresh.</div>
          ) : (
            <ul className="file-list">
              {files.map((file) => (
                <li key={file.name}>
                  <a className={`file-link ${selected?.name === file.name ? "active" : ""}`} href={file.href}>
                    <span className="file-name">{file.name}</span>
                    <span className="file-meta">{file.displayDate}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="panel viewer">
          <div className="topline">
            <h2>{selected ? selected.name : "No file selected"}</h2>
            {selected ? <div className="small-note">{selected.displayDate}</div> : null}
          </div>

          {selected && html ? (
            <iframe
              className="viewer-frame"
              title={selected.name}
              srcDoc={html}
              sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
            />
          ) : (
            <div className="empty-state">
              <div>
                <p>No matching HTML file found yet.</p>
                <p className="small-note">Create one in `sites/` using the filename format above.</p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
