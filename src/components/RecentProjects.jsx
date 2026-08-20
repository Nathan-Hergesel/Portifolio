"use client";

import { motion, useReducedMotion } from "motion/react";
import { BsArrowUpRight, BsPlayFill } from "react-icons/bs";

const easeOutExpo = [0.16, 1, 0.3, 1];

const reveal = {
  rest: { y: 24 },
  visible: (delay = 0) => ({
    y: 0,
    transition: {
      duration: 0.72,
      delay,
      ease: easeOutExpo
    }
  })
};

const projects = [
  {
    id: "vjs",
    index: "01",
    category: "Site",
    title: "VJS Sistemas",
    description: "Estratégia, interface e desenvolvimento comercial.",
    image: "/assets/images/projects/vjs-sistemas.webp",
    alt: "Página inicial do site VJS Sistemas",
    href: "https://vjssistemas.com.br/"
  },
  {
    id: "mercearia",
    index: "02",
    category: "App",
    title: "Mercearia Fácil",
    description: "Vendas, estoque e fornecedores para pequenos comércios.",
    image: "/assets/images/projects/mercearia-facil.webp",
    alt: "Apresentação do aplicativo Mercearia Fácil"
  },
  {
    id: "obraflow",
    index: "03",
    category: "Sistema",
    title: "ObraFlow",
    description: "Cronograma, equipe, custos e indicadores em um painel.",
    image: "/assets/images/projects/obraflow.webp",
    alt: "Interface do sistema de gestão de obras ObraFlow"
  },
  {
    id: "estudai",
    index: "04",
    category: "App",
    title: "EstudAí",
    description: "Organização e rotina de estudos em uma experiência mobile.",
    image: "/assets/images/projects/estudai-atualizado.png",
    alt: "Tela de acesso atualizada do aplicativo EstudAí"
  },
  {
    id: "brisa",
    index: "05",
    category: "Design",
    title: "Brisa Solar",
    description: "Comunicação visual para energia residencial.",
    image: "/assets/images/projects/brisa-solar.webp",
    alt: "Composição visual da marca Brisa Solar"
  },
  {
    id: "serra",
    index: "06",
    category: "Design",
    title: "Serra Labs",
    description: "Identidade para consultoria em tecnologia e IA.",
    image: "/assets/images/projects/serra-labs.webp",
    alt: "Kit de identidade visual da Serra Labs"
  },
  {
    id: "aurora",
    index: "07",
    category: "Design",
    title: "Aurora Casa",
    description: "Identidade para interiores e decoração.",
    image: "/assets/images/projects/aurora-casa.webp",
    alt: "Kit de identidade visual da Aurora Casa"
  }
];

const summary = [
  ["Sites", "01"],
  ["Apps", "02"],
  ["Sistemas", "01"],
  ["Designs", "03"],
  ["Vídeos", "00"]
];

function BentoTile({ project }) {
  const content = (
    <>
      <img src={project.image} alt={project.alt} loading="eager" decoding="async" />
      <span className="bento-tile-shade" aria-hidden="true" />
      <header className="bento-tile-meta">
        <span>{project.index}</span>
        <small>{project.category}</small>
      </header>
      <div className="bento-tile-copy">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      {project.href && (
        <span className="bento-tile-open" aria-hidden="true">
          <BsArrowUpRight />
        </span>
      )}
    </>
  );

  return (
    <article
      className={`bento-tile bento-tile-${project.id}`}
      id={`projeto-${project.id}`}
    >
      {project.href ? (
        <a
          className="bento-tile-link"
          href={project.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visitar ${project.title}`}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </article>
  );
}

function VideoTile() {
  return (
    <article className="bento-tile bento-tile-video">
      <span className="bento-video-label">08 / Vídeos</span>
      <div>
        <h3>Em produção.</h3>
        <a href="#contato">
          Planejar um vídeo
          <BsArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <BsPlayFill className="bento-video-icon" aria-hidden="true" />
    </article>
  );
}

export function RecentProjects() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="recent-projects project-bento section"
      id="projetos"
      aria-labelledby="recent-projects-title"
    >
      <motion.header
        className="bento-intro"
        variants={reveal}
        initial={reducedMotion ? false : "rest"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div>
          <span className="section-code">01 / Trabalhos selecionados</span>
          <h2 id="recent-projects-title">
            Um mapa de
            <br />
            projetos<span>.</span>
          </h2>
        </div>
        <div className="bento-intro-copy">
          <p>
            Produtos digitais e identidades reunidos em uma composição única,
            sem separar criação e tecnologia.
          </p>
          <ul aria-label="Quantidade de trabalhos por categoria">
            {summary.map(([label, count]) => (
              <li key={label}>
                <span>{label}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      </motion.header>

      <div className="bento-grid">
        {projects.map((project) => (
          <BentoTile project={project} key={project.id} />
        ))}
        <VideoTile />
      </div>

      <footer className="bento-outro">
        <p>O próximo espaço pode ser do seu projeto.</p>
        <a href="#contato">
          Vamos conversar
          <BsArrowUpRight aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
