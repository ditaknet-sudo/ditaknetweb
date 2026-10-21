import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_FILES: Record<string, string> = {
  "scanner-exe": "DitakNet-Scanner.exe",
  "scanner-ps1": "DitakNet-Scanner.ps1",
  "ditaknet-scanner.exe": "DitakNet-Scanner.exe",
  "ditaknet-scanner.ps1": "DitakNet-Scanner.ps1",
  monitoring: "monitoring.zip",
  "patch-panel": "patch-panel.zip",
  "network-explorer": "network-explorer.zip",
  "lan-scan": "DitakNet-Scanner.exe",
  "vlan-scan": "DitakNet-Scanner.exe",
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
  const fileName =
    ALLOWED_FILES[slug.toLowerCase()] ||
    (slug.endsWith(".exe") || slug.endsWith(".ps1") || slug.endsWith(".zip") ? slug : null);

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

    let contentType = "application/octet-stream";
    if (fileName.endsWith(".exe")) {
      contentType = "application/vnd.microsoft.portable-executable";
    } else if (fileName.endsWith(".ps1")) {
      contentType = "text/plain; charset=utf-8";
    } else if (fileName.endsWith(".zip")) {
      contentType = "application/zip";
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
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
