export type DownloadItemId =
  | "monitoring"
  | "patch-panel"
  | "network-explorer"
  | "lan-scan"
  | "vlan-scan"
  | "cctv-probe"
  | "bandwidth-test"
  | "subnet-calculator"
  | "port-audit"
  | "ip-messenger"
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
 * Real, self-contained standalone packages live under /downloads/*.zip.
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
      id: "ip-messenger",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_IP_MESSENGER_URL",
      placeholderUrl: "/downloads/ip-messenger.zip"
    },
    {
      id: "patch-panel",
      platforms: ["windows", "linux", "docker"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_PATCH_PANEL_URL",
      placeholderUrl: "/downloads/patch-panel.zip"
    },
    {
      id: "network-explorer",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_NETWORK_EXPLORER_URL",
      placeholderUrl: "/downloads/network-explorer.zip"
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
      id: "cctv-probe",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_CCTV_PROBE_URL",
      placeholderUrl: "/downloads/cctv-probe.zip"
    },
    {
      id: "bandwidth-test",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_BANDWIDTH_TEST_URL",
      placeholderUrl: "/downloads/bandwidth-test.zip"
    },
    {
      id: "subnet-calculator",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_SUBNET_CALC_URL",
      placeholderUrl: "/downloads/subnet-calculator.zip"
    },
    {
      id: "port-audit",
      platforms: ["windows", "linux"],
      versionLabel: "v1",
      envKey: "NEXT_PUBLIC_DOWNLOAD_PORT_AUDIT_URL",
      placeholderUrl: "/downloads/port-audit.zip"
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
