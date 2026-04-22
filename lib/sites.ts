import fs from "node:fs/promises";
import path from "node:path";

const SITES_DIR = path.join(process.cwd(), "sites");
const MOM_DIR = path.join(process.cwd(), "mom");
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

function getDirForSource(source: "sites" | "mom") {
  return source === "mom" ? MOM_DIR : SITES_DIR;
}

export async function getSiteFiles(source: "sites" | "mom" = "sites") {
  const dir = getDirForSource(source);
  const basePath = source === "mom" ? "/mom" : "/";
  let entries: string[] = [];

  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  return entries
    .filter((name) => name.endsWith(".html"))
    .map((name) => {
      const parsed = parseSiteFilename(name);
      return parsed ? { name, href: `${basePath}?file=${encodeURIComponent(name)}`, ...parsed } : null;
    })
    .filter((file): file is SiteFile => file !== null)
    .sort((a, b) => b.timestamp - a.timestamp || a.name.localeCompare(b.name));
}

export async function getLatestSiteFile(source: "sites" | "mom" = "sites") {
  const files = await getSiteFiles(source);
  return files[0] ?? null;
}

export async function getSiteHtml(name: string, source: "sites" | "mom" = "sites") {
  const parsed = parseSiteFilename(name);
  if (!parsed) {
    return null;
  }

  const filePath = path.join(getDirForSource(source), name);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const scrollFix = `<style>html,body{overflow:auto!important;height:auto!important;min-height:100%!important}</style>`;
    return raw.replace(/<head([^>]*)>/i, `<head$1>${scrollFix}`);
  } catch {
    return null;
  }
}

export function isValidSiteFileName(name: string) {
  return SITE_FILE_PATTERN.test(name);
}
