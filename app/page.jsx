import { PortfolioChrome } from "../src/components/PortfolioChrome";
import { CreativeProcess } from "../src/components/CreativeProcess";
import { Footer } from "../src/components/Footer";
import { Hero } from "../src/components/Hero";
import { ProjectCta } from "../src/components/ProjectCta";
import { ProjectStages } from "../src/components/ProjectStages";
import { RecentProjects } from "../src/components/RecentProjects";
import { Testimonials } from "../src/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <PortfolioChrome />

      <main className="min-w-0" id="conteudo">
        <Hero />
        <div className="ticker" aria-hidden="true" />
        <RecentProjects />
        <CreativeProcess />
        <ProjectStages />
        <Testimonials />
        <ProjectCta />
      </main>

      <Footer />
    </>
  );
}
