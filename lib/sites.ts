import fs from "node:fs/promises";
import path from "node:path";

const SITES_DIR = path.join(process.cwd(), "sites");
const SITE_FILE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})\.html$/;

export type SiteFile = {
  name: string;
  href: string;
  timestamp: number;
  displayDate: string;
};

function parseSiteFilename(name: string) {
  const match = SITE_FILE_PATTERN.exec(name);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;
  const timestamp = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  return {
    timestamp,
    displayDate: `${year}-${month}-${day} ${hour}:${minute}`,
  };
}

export async function getSiteFiles() {
  let entries: string[] = [];

  try {
    entries = await fs.readdir(SITES_DIR);
  } catch {
    return [];
  }

  return entries
    .filter((name) => name.endsWith(".html"))
    .map((name) => {
      const parsed = parseSiteFilename(name);
      return parsed ? { name, href: `/?file=${encodeURIComponent(name)}`, ...parsed } : null;
    })
    .filter((file): file is SiteFile => file !== null)
    .sort((a, b) => b.timestamp - a.timestamp || a.name.localeCompare(b.name));
}

export async function getLatestSiteFile() {
  const files = await getSiteFiles();
  return files[0] ?? null;
}

export async function getSiteHtml(name: string) {
  const parsed = parseSiteFilename(name);
  if (!parsed) {
    return null;
  }

  const filePath = path.join(SITES_DIR, name);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export function isValidSiteFileName(name: string) {
  return SITE_FILE_PATTERN.test(name);
}
