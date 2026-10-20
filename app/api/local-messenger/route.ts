import { NextRequest, NextResponse } from "next/server";

export type LanMessage = {
  id: string;
  senderIp: string;
  senderName: string;
  recipientIp: string;
  recipientName: string;
  content: string;
  snippetType?: "text" | "ipconfig" | "ping" | "alert" | "file";
  fileName?: string;
  fileData?: string;
  timestamp: number;
};

// In-memory local message ring buffer (kept strictly in local server RAM, max 500 entries)
const messageStore: LanMessage[] = [];
const activePeers = new Map<string, { ip: string; name: string; lastSeen: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const myIp = url.searchParams.get("ip") || getClientIp(request);
  const peerIp = url.searchParams.get("peerIp");
  const since = Number(url.searchParams.get("since") || "0");

  // Track active peer
  const clientName = url.searchParams.get("name") || "LAN Client";
  activePeers.set(myIp, { ip: myIp, name: clientName, lastSeen: Date.now() });

  // Clean up peers inactive for > 5 minutes
  const now = Date.now();
  for (const [ip, peer] of activePeers.entries()) {
    if (now - peer.lastSeen > 300000) {
      activePeers.delete(ip);
    }
  }

  // Filter messages between myIp and peerIp (or all for myIp)
  let filtered = messageStore.filter((m) => m.timestamp > since);
  if (peerIp) {
    filtered = filtered.filter(
      (m) =>
        (m.senderIp === myIp && m.recipientIp === peerIp) ||
        (m.senderIp === peerIp && m.recipientIp === myIp) ||
        m.recipientIp === "255.255.255.255" // Broadcast
    );
  } else {
    filtered = filtered.filter(
      (m) => m.senderIp === myIp || m.recipientIp === myIp || m.recipientIp === "255.255.255.255"
    );
  }

  return NextResponse.json({
    clientIp: myIp,
    messages: filtered,
    activePeers: Array.from(activePeers.values()),
    serverTime: Date.now()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request);

    const message: LanMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderIp: body.senderIp || clientIp,
      senderName: body.senderName || "Unknown Peer",
      recipientIp: body.recipientIp || "255.255.255.255",
      recipientName: body.recipientName || "LAN Broadcast",
      content: String(body.content || "").slice(0, 4000),
      snippetType: body.snippetType || "text",
      fileName: body.fileName,
      fileData: body.fileData,
      timestamp: Date.now()
    };

    messageStore.push(message);
    if (messageStore.length > 500) {
      messageStore.shift();
    }

    // Keep active peer record
    activePeers.set(message.senderIp, {
      ip: message.senderIp,
      name: message.senderName,
      lastSeen: Date.now()
    });

    return NextResponse.json({ success: true, message });
  } catch (err) {
    return NextResponse.json({ error: "Invalid message payload" }, { status: 400 });
  }
}
