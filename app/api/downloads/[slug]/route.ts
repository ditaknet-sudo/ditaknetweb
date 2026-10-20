import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_FILES: Record<string, string> = {
  monitoring: "monitoring.zip",
  "patch-panel": "patch-panel.zip",
  "network-explorer": "network-explorer.zip",
  "lan-scan": "lan-scan.zip",
  "vlan-scan": "vlan-scan.zip",
  "cctv-probe": "cctv-probe.zip",
  "bandwidth-test": "bandwidth-test.zip",
  "subnet-calculator": "subnet-calculator.zip",
  "port-audit": "port-audit.zip",
  "ip-messenger": "ip-messenger.zip",
  cloud: "cloud.zip",
  "service-watch": "service-watch.zip"
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const fileName = ALLOWED_FILES[slug] || (slug.endsWith(".zip") ? slug : null);

  if (!fileName) {
    return NextResponse.json(
      { error: "Requested download file not found" },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), "public", "downloads", fileName);

  try {
    const fileStat = await fs.promises.stat(filePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not a file" }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="ditaknet-${fileName}"`,
        "Content-Length": String(fileStat.size),
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (err) {
    console.error(`Failed to serve download ${fileName}:`, err);
    return NextResponse.json(
      { error: "Download package currently unavailable on server" },
      { status: 404 }
    );
  }
}
