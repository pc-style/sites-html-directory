import { notFound } from "next/navigation";
import { getLatestSiteFile, getSiteFiles, getSiteHtml, isValidSiteFileName } from "@/lib/sites";
import { Viewer } from "./viewer";

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
      <header className="header">
        <h1 className="header-title">Sites <em>Archive</em></h1>
        <span className="header-meta">{files.length} file{files.length === 1 ? "" : "s"}</span>
      </header>

      <section className="layout">
        <aside className="sidebar">
          <div className="sidebar-label">Directory</div>
          {files.length === 0 ? (
            <div className="no-files">No HTML files found.</div>
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

        <Viewer
          name={selected?.name ?? null}
          date={selected?.displayDate ?? null}
          html={html}
        />
      </section>
    </main>
  );
}
