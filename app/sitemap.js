export const dynamic = "force-static";

export default function sitemap() {
  return [
    {
      url: "https://nathanhergesel.me/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
