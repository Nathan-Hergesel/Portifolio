"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BsArrowUpRight, BsPlayFill } from "react-icons/bs";

import { ProjectFilter } from "./ProjectFilter";
import { ProjectWall } from "./ProjectWall";

const easeOutExpo = [0.16, 1, 0.3, 1];

const reveal = {
  rest: { y: 24 },
  visible: (delay = 0) => ({
    y: 0,
    transition: {
      duration: 0.72,
      delay,
      ease: easeOutExpo,
    },
  }),
};

// Entrada e saida dos tiles ao trocar de filtro. `layout` cuida do rearranjo dos
// que permanecem; estes valores cuidam de quem entra e de quem sai.
const entrada = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
  transition: { duration: 0.38, ease: easeOutExpo },
};

const projects = [
  {
    id: "vjs",
    featured: true,
    index: "01",
    category: "Site",
    title: "VJS Sistemas",
    description: "Estratégia, interface e desenvolvimento comercial.",
    image: "/assets/images/projects/vjs-sistemas.webp",
    wallImage: "/assets/images/projects/wall/vjs-sistemas.webp",
    aspect: 2.1,
    alt: "Página inicial do site VJS Sistemas",
    href: "https://vjssistemas.com.br/",
  },
  {
    id: "mercearia",
    featured: true,
    index: "02",
    category: "App",
    title: "Mercearia Fácil",
    description: "Vendas, estoque e fornecedores para pequenos comércios.",
    image: "/assets/images/projects/mercearia-facil.webp",
    wallImage: "/assets/images/projects/wall/mercearia-facil.webp",
    aspect: 1,
    alt: "Apresentação do aplicativo Mercearia Fácil",
  },
  {
    id: "obraflow",
    featured: true,
    index: "03",
    category: "Sistema",
    title: "ObraFlow",
    description: "Cronograma, equipe, custos e indicadores em um painel.",
    image: "/assets/images/projects/obraflow.webp",
    wallImage: "/assets/images/projects/wall/obraflow.webp",
    aspect: 0.8,
    alt: "Interface do sistema de gestão de obras ObraFlow",
  },
  {
    id: "estudai",
    index: "04",
    category: "App",
    title: "EstudAí",
    description: "Organização e rotina de estudos em uma experiência mobile.",
    image: "/assets/images/projects/estudai-atualizado.png",
    wallImage: "/assets/images/projects/wall/estudai-atualizado.webp",
    aspect: 0.462,
    alt: "Tela de acesso atualizada do aplicativo EstudAí",
  },
  {
    id: "brisa",
    featured: true,
    index: "05",
    category: "Design",
    title: "Brisa Solar",
    description: "Comunicação visual para energia residencial.",
    image: "/assets/images/projects/brisa-solar.webp",
    wallImage: "/assets/images/projects/wall/brisa-solar.webp",
    aspect: 1,
    alt: "Composição visual da marca Brisa Solar",
  },
  {
    id: "serra",
    index: "06",
    category: "Design",
    title: "Serra Labs",
    description: "Identidade para consultoria em tecnologia e IA.",
    image: "/assets/images/projects/serra-labs.webp",
    wallImage: "/assets/images/projects/wall/serra-labs.webp",
    aspect: 0.8,
    alt: "Kit de identidade visual da Serra Labs",
  },
  {
    id: "aurora",
    index: "07",
    category: "Design",
    title: "Aurora Casa",
    description: "Identidade para interiores e decoração.",
    image: "/assets/images/projects/aurora-casa.webp",
    wallImage: "/assets/images/projects/wall/aurora-casa.webp",
    aspect: 0.8,
    alt: "Kit de identidade visual da Aurora Casa",
  },
  {
    id: "morcegao",
    featured: true,
    index: "08",
    category: "Sistema",
    title: "Portal Morcegão",
    description: "Portal interno de supermercado com canal de escuta anônimo.",
    image: "/assets/images/projects/morcegao.webp",
    wallImage: "/assets/images/projects/wall/morcegao.webp",
    aspect: 1.78,
    alt: "Tela de acesso do portal interno do Supermercado Morcegão",
    href: "https://supermercadomorcegao.tech/entrar",
  },
];

function BentoTile({ project, reducedMotion }) {
  const content = (
    <>
      <img
        src={project.image}
        alt={project.alt}
        loading="eager"
        decoding="async"
      />
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
    <motion.article
      className={`bento-tile bento-tile-${project.id}`}
      id={`projeto-${project.id}`}
      layout={!reducedMotion}
      initial={reducedMotion ? false : entrada.initial}
      animate={entrada.animate}
      exit={reducedMotion ? undefined : entrada.exit}
      transition={entrada.transition}
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
    </motion.article>
  );
}

function VideoTile({ reducedMotion }) {
  return (
    <motion.article
      className="bento-tile bento-tile-video"
      layout={!reducedMotion}
      initial={reducedMotion ? false : entrada.initial}
      animate={entrada.animate}
      exit={reducedMotion ? undefined : entrada.exit}
      transition={entrada.transition}
    >
      <span className="bento-video-label">09 / Vídeos</span>
      <div>
        <h3>Em produção.</h3>
        <a href="#contato">
          Planejar um vídeo
          <BsArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <BsPlayFill className="bento-video-icon" aria-hidden="true" />
    </motion.article>
  );
}

export function RecentProjects() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState("destaque");

  const counts = useMemo(() => {
    // "Em destaque" mostra um item por categoria, entao a contagem dele nao e o
    // total de projetos e sim quantas categorias tem representante.
    const tally = { Vídeo: 0 };
    projects.forEach((project) => {
      tally[project.category] = (tally[project.category] ?? 0) + 1;
    });
    tally.total = projects.filter((project) => project.featured).length + 1;
    return tally;
  }, []);

  const emDestaque = active === "destaque";
  const visiveis = useMemo(
    () =>
      projects.filter((project) =>
        emDestaque ? project.featured : project.category === active,
      ),
    [active, emDestaque],
  );
  // O card de video representa a categoria mesmo sem itens, entao aparece no
  // destaque e quando o proprio filtro de video esta ativo.
  const mostrarVideo = emDestaque || active === "Vídeo";

  return (
    <section
      className="recent-projects project-bento section"
      id="projetos"
      aria-labelledby="recent-projects-title"
    >
      <ProjectWall projects={projects} />

      <div className="bento-plate">
        <motion.header
          className="bento-intro"
          variants={reveal}
          initial={reducedMotion ? false : "rest"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="section-code">01 / Trabalhos selecionados</span>
          <h2 id="recent-projects-title">
            Um mapa de
            <br />
            projetos<span>.</span>
          </h2>
          <p className="bento-intro-lede">
            Produtos digitais e identidades reunidos em uma composição única,
            sem separar criação e tecnologia.
          </p>
          <ProjectFilter active={active} onChange={setActive} counts={counts} />
        </motion.header>

        <div className={`bento-grid ${emDestaque ? "" : "is-filtered"}`.trim()}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visiveis.map((project) => (
              <BentoTile
                project={project}
                reducedMotion={reducedMotion}
                key={project.id}
              />
            ))}
            {mostrarVideo && (
              <VideoTile reducedMotion={reducedMotion} key="video" />
            )}
          </AnimatePresence>
        </div>

        <footer className="bento-outro">
          <p>O próximo espaço pode ser do seu projeto.</p>
          <a href="#contato">
            Vamos conversar
            <BsArrowUpRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
}
