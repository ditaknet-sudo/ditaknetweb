export type DownloadItemId =
  | "monitoring"
  | "lan-scan"
  | "vlan-scan"
  | "cloud"
  | "service-watch";

export type DownloadItem = {
  id: DownloadItemId;
  platforms: Array<"windows" | "docker" | "linux" | "truenas">;
  versionLabel: string;
  url: string;
  available: boolean;
};

function envUrl(key: string) {
  const value = process.env[key]?.trim() || "";
  return value;
}

/**
 * Customer-facing downloads for DitakNet programs/tools.
 * Temporary placeholder ZIPs live under /downloads/*.zip until real package URLs are provided.
 * Override any item with NEXT_PUBLIC_DOWNLOAD_*_URL when ready.
 */
export function getDownloadCatalog(): DownloadItem[] {
  const items: Array<{
    id: DownloadItemId;
    platforms: DownloadItem["platforms"];
    versionLabel: string;
    envKey: string;
    placeholderUrl: string;
  }> = [
    {
      id: "monitoring",
      platforms: ["docker", "linux", "truenas"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_MONITORING_URL",
      placeholderUrl: "/downloads/monitoring.zip"
    },
    {
      id: "lan-scan",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_LAN_SCAN_URL",
      placeholderUrl: "/downloads/lan-scan.zip"
    },
    {
      id: "vlan-scan",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_VLAN_SCAN_URL",
      placeholderUrl: "/downloads/vlan-scan.zip"
    },
    {
      id: "cloud",
      platforms: ["docker", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_CLOUD_URL",
      placeholderUrl: "/downloads/cloud.zip"
    },
    {
      id: "service-watch",
      platforms: ["windows", "linux", "docker"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_SERVICE_WATCH_URL",
      placeholderUrl: "/downloads/service-watch.zip"
    }
  ];

  return items.map((item) => {
    const configured = envUrl(item.envKey);
    const url = configured || item.placeholderUrl;
    return {
      id: item.id,
      platforms: item.platforms,
      versionLabel: item.versionLabel,
      url,
      available: true
    };
  });
}
