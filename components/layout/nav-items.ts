export const primaryNav = [
  { key: "monitoring", href: "monitoring" },
  { key: "tools", href: "tools" },
  { key: "pricing", href: "pricing" },
  { key: "contact", href: "contact" }
] as const;

export const moreNav = [
  { key: "product", href: "product" },
  { key: "features", href: "features" },
  { key: "deployment", href: "deployment" },
  { key: "security", href: "security" },
  { key: "docs", href: "docs" },
  { key: "about", href: "about" }
] as const;

export const allNav = [
  { key: "download", href: "download" },
  ...primaryNav,
  ...moreNav
] as const;
