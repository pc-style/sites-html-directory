import { NextRequest, NextResponse } from "next/server";
import { getLatestSiteFile } from "@/lib/sites";

export async function GET(request: NextRequest) {
  const latest = await getLatestSiteFile();
  const target = latest ? `/?file=${encodeURIComponent(latest.name)}` : "/";
  return NextResponse.redirect(new URL(target, request.url));
}
