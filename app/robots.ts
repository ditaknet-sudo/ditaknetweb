import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

const disallowPrivate = [
  "/api/",
  "/*/admin/",
  "/*/account/",
  "/*/login",
  "/*/logout",
  "/*/register",
  "/*/support/tickets/"
];

/** Prefer indexing all public pages; private app areas stay blocked. */
const allowPublic = ["/", "/llms.txt", "/ai.txt", "/sitemap.xml"];

const aiUserAgents = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "PerplexityBot",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "YouBot"
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: allowPublic,
        disallow: disallowPrivate
      },
      ...aiUserAgents.map((userAgent) => ({
        userAgent,
        allow: allowPublic,
        disallow: disallowPrivate
      }))
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
