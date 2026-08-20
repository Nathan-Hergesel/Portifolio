import { PortfolioChrome } from "../src/components/PortfolioChrome";
import { ConstructionSections } from "../src/components/ConstructionSections";
import { Footer } from "../src/components/Footer";
import { Hero } from "../src/components/Hero";
import { RecentProjects } from "../src/components/RecentProjects";

export default function HomePage() {
  return (
    <>
      <PortfolioChrome />

      <main className="min-w-0" id="conteudo">
        <Hero />
        <div className="ticker" aria-hidden="true" />
        <RecentProjects />
        <ConstructionSections />
      </main>

      <Footer />
    </>
  );
}
