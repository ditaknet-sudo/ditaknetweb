import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DitakNet Network & IT Tools",
    short_name: "DitakNet",
    description:
      "Self-hosted network monitoring, LAN/VLAN scanner, interactive patch panel manager, and IT toolkit.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0f1419",
    theme_color: "#1769aa",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
