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
 * Set NEXT_PUBLIC_DOWNLOAD_*_URL in env (absolute URL or site-relative path like /downloads/lan-scan.zip).
 */
export function getDownloadCatalog(): DownloadItem[] {
  const items: Array<Omit<DownloadItem, "available"> & { envKey: string }> = [
    {
      id: "monitoring",
      platforms: ["docker", "linux", "truenas"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_MONITORING_URL",
      url: ""
    },
    {
      id: "lan-scan",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_LAN_SCAN_URL",
      url: ""
    },
    {
      id: "vlan-scan",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_VLAN_SCAN_URL",
      url: ""
    },
    {
      id: "cloud",
      platforms: ["docker", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_CLOUD_URL",
      url: ""
    },
    {
      id: "service-watch",
      platforms: ["windows", "linux", "docker"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_SERVICE_WATCH_URL",
      url: ""
    }
  ];

  return items.map((item) => {
    const url = envUrl(item.envKey) || `/downloads/${item.id}.zip`;
    const available = Boolean(envUrl(item.envKey));
    return {
      id: item.id,
      platforms: item.platforms,
      versionLabel: item.versionLabel,
      url,
      available
    };
  });
}
