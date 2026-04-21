import { getLatestSiteFile, getSiteHtml } from "@/lib/sites";

export default async function RecentPage() {
  const latest = await getLatestSiteFile();
  const html = latest ? await getSiteHtml(latest.name) : null;

  if (!latest || !html) {
    return <div className="recent-empty"><p>No HTML files found in the archive.</p></div>;
  }

  return (
    <div className="recent-page">
      <a href="/" className="recent-back">Back to directory</a>
      <iframe
        title={latest.name}
        srcDoc={html}
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
      />
    </div>
  );
}
