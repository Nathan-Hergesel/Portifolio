"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

// A ordem aqui e a ordem do destaque: Morcegao e o video do Trend Cast na primeira
// faixa, TPark e Brisa na segunda, ObraFlow e EstudAi na terceira (ver os spans
// no fim do styles.css).
// Nos videos, `image` e a capa (um quadro do proprio video) e `video` o arquivo
// que toca no card.
const projects = [
  {
    id: "morcegao",
    featured: true,
    index: "01",
    category: "Sistema",
    title: "Portal Morcegão",
    description: "Portal interno de supermercado com canal de escuta anônimo.",
    image: "/assets/images/projects/morcegao.webp",
    wallImage: "/assets/images/projects/wall/morcegao.webp",
    aspect: 1.78,
    alt: "Tela de acesso do portal interno do Supermercado Morcegão",
  },
  {
    id: "trendcast",
    featured: true,
    index: "02",
    category: "Vídeo",
    title: "Trend Cast",
    description: "Vídeo em motion graphics apresentando o produto.",
    image: "/assets/images/projects/trendcast.webp",
    wallImage: "/assets/images/projects/wall/trendcast.webp",
    video: "/assets/videos/trendcast.mp4",
    aspect: 1.78,
    alt: "Vídeo de apresentação do Trend Cast",
  },
  {
    id: "vjs",
    index: "03",
    category: "Site",
    title: "VJS Sistemas",
    description: "Estratégia, interface e desenvolvimento comercial.",
    image: "/assets/images/projects/vjs-sistemas.webp",
    wallImage: "/assets/images/projects/wall/vjs-sistemas.webp",
    aspect: 2.1,
    alt: "Página inicial do site VJS Sistemas",
  },
  {
    id: "tpark",
    featured: true,
    index: "04",
    category: "Site",
    title: "TPark Estacionamentos",
    description: "Site comercial para gestão e automação de estacionamentos.",
    image: "/assets/images/projects/tpark.webp",
    wallImage: "/assets/images/projects/wall/tpark.webp",
    aspect: 1.78,
    alt: "Página inicial do site da TPark Estacionamentos",
  },
  {
    id: "mercearia",
    index: "05",
    category: "App",
    title: "Mercearia Fácil",
    description: "Vendas, estoque e fornecedores para pequenos comércios.",
    image: "/assets/images/projects/mercearia-facil.webp",
    wallImage: "/assets/images/projects/wall/mercearia-facil.webp",
    aspect: 1,
    alt: "Apresentação do aplicativo Mercearia Fácil",
  },
  {
    id: "brisa",
    featured: true,
    index: "06",
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
    index: "07",
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
    index: "08",
    category: "Design",
    title: "Aurora Casa",
    description: "Identidade para interiores e decoração.",
    image: "/assets/images/projects/aurora-casa.webp",
    wallImage: "/assets/images/projects/wall/aurora-casa.webp",
    aspect: 0.8,
    alt: "Kit de identidade visual da Aurora Casa",
  },
  {
    id: "obraflow",
    featured: true,
    index: "09",
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
    featured: true,
    index: "10",
    category: "App",
    title: "EstudAí",
    description: "Organização e rotina de estudos em uma experiência mobile.",
    image: "/assets/images/projects/estudai.webp",
    wallImage: "/assets/images/projects/wall/estudai.webp",
    aspect: 1.11,
    alt: "Apresentação do aplicativo EstudAí com a tela de acesso no celular",
  },
  {
    id: "anuncio",
    index: "11",
    category: "Vídeo",
    title: "Anúncio Hergesel.dev",
    description: "Anúncio em motion para divulgar os serviços do site.",
    image: "/assets/images/projects/anuncio-hergesel.webp",
    wallImage: "/assets/images/projects/wall/anuncio-hergesel.webp",
    video: "/assets/videos/anuncio-hergesel.mp4",
    aspect: 1.78,
    alt: "Vídeo de anúncio dos serviços de Nathan Hergesel",
  },
];

// Video no card: toca sem som e em loop so enquanto o card esta visivel, para nao
// pesar a pagina. "Assistir com som" liga o audio e os controles do player. Com
// movimento reduzido nao ha autoplay; a capa fica ate a pessoa pedir.
function TileVideo({ project, reducedMotion, withSound, onSound }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion || withSound) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion, withSound]);

  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
    onSound();
  };

  return (
    <>
      <video
        ref={videoRef}
        src={project.video}
        poster={project.image}
        muted
        loop={!withSound}
        playsInline
        preload="none"
        controls={withSound}
        aria-label={project.alt}
      />
      {!withSound && (
        <button className="bento-video-play" type="button" onClick={playWithSound}>
          <BsPlayFill aria-hidden="true" />
          Assistir com som
        </button>
      )}
    </>
  );
}

function BentoTile({ project, reducedMotion }) {
  const [withSound, setWithSound] = useState(false);

  const content = (
    <>
      {project.video ? (
        <TileVideo
          project={project}
          reducedMotion={reducedMotion}
          withSound={withSound}
          onSound={() => setWithSound(true)}
        />
      ) : (
        <img
          src={project.image}
          alt={project.alt}
          loading="eager"
          decoding="async"
        />
      )}
      <span className="bento-tile-shade" aria-hidden="true" />
      <header className="bento-tile-meta">
        <span>{project.index}</span>
        <small>{project.category}</small>
      </header>
      <div className="bento-tile-copy">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </>
  );

  return (
    <motion.article
      className={`bento-tile bento-tile-${project.id}`}
      id={`projeto-${project.id}`}
      data-sound={withSound || undefined}
      layout={!reducedMotion}
      initial={reducedMotion ? false : entrada.initial}
      animate={entrada.animate}
      exit={reducedMotion ? undefined : entrada.exit}
      transition={entrada.transition}
    >
      {content}
    </motion.article>
  );
}

export function RecentProjects() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState("destaque");

  const counts = useMemo(() => {
    // "Em destaque" mostra um item por categoria, entao a contagem dele nao e o
    // total de projetos e sim quantas categorias tem representante.
    const tally = {};
    projects.forEach((project) => {
      tally[project.category] = (tally[project.category] ?? 0) + 1;
    });
    tally.total = projects.filter((project) => project.featured).length;
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
