export const dynamic = "force-static";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: "https://nathanhergesel.me/sitemap.xml",
    host: "https://nathanhergesel.me"
  };
}
