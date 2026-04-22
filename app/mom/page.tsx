import { getLatestSiteFile, getSiteHtml } from "@/lib/sites";

export default async function MomPage() {
  const latest = await getLatestSiteFile("mom");
  const html = latest ? await getSiteHtml(latest.name, "mom") : null;

  if (!latest || !html) {
    return <div className="recent-empty"><p>No HTML files found.</p></div>;
  }

  return (
    <div className="recent-page">
      <iframe
        title={latest.name}
        srcDoc={html}
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
      />
    </div>
  );
}
