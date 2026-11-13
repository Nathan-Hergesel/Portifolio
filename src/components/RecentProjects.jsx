"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BsArrowUpRight, BsXLg } from "react-icons/bs";

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

// A ordem aqui e a ordem do destaque. A primeira linha e fixa: o Portal Morcegao
// grande (`destaque: "grande"`) e, ao lado, os dois videos empilhados
// (`destaque: "pilha"`). As demais saem em linhas justificadas: TPark e EstudAi;
// ObraFlow e os tres designs. `aspect` e a proporcao real da imagem (largura /
// altura): o destaque usa esse valor para mostrar cada arte inteira, sem corte.
// Nos videos, `image` e a capa (um quadro do proprio video) e `video` o arquivo
// que toca no card.
const projects = [
  {
    id: "morcegao",
    featured: true,
    destaque: "grande",
    index: "01",
    category: "Sistema",
    title: "Portal Morcegão",
    description: "Portal interno de supermercado com canal de escuta anônimo.",
    image: "/assets/images/projects/morcegao.webp",
    wallImage: "/assets/images/projects/wall/morcegao.webp",
    aspect: 16 / 9,
    alt: "Tela de acesso do portal interno do Supermercado Morcegão",
  },
  {
    id: "trendcast",
    featured: true,
    destaque: "pilha",
    index: "02",
    category: "Vídeo",
    title: "Trend Cast",
    description: "Vídeo em motion graphics apresentando o produto.",
    image: "/assets/images/projects/trendcast.webp",
    wallImage: "/assets/images/projects/wall/trendcast.webp",
    video: "/assets/videos/trendcast.mp4",
    aspect: 16 / 9,
    alt: "Vídeo de apresentação do Trend Cast",
  },
  {
    id: "anuncio",
    featured: true,
    destaque: "pilha",
    index: "03",
    category: "Vídeo",
    title: "Hergesel.dev",
    description: "Anúncio em motion para divulgar os serviços do site.",
    image: "/assets/images/projects/anuncio-hergesel.webp",
    wallImage: "/assets/images/projects/wall/anuncio-hergesel.webp",
    video: "/assets/videos/anuncio-hergesel.mp4",
    aspect: 16 / 9,
    alt: "Vídeo de anúncio dos serviços de Nathan Hergesel",
  },
  {
    id: "vjs",
    index: "04",
    category: "Site",
    title: "VJS Sistemas",
    description: "Estratégia, interface e desenvolvimento comercial.",
    image: "/assets/images/projects/vjs-sistemas.webp",
    wallImage: "/assets/images/projects/wall/vjs-sistemas.webp",
    aspect: 1600 / 762,
    alt: "Página inicial do site VJS Sistemas",
  },
  {
    id: "tpark",
    featured: true,
    index: "05",
    category: "Site",
    title: "TPark Estacionamentos",
    description: "Site comercial para gestão e automação de estacionamentos.",
    image: "/assets/images/projects/tpark.webp",
    wallImage: "/assets/images/projects/wall/tpark.webp",
    aspect: 16 / 9,
    alt: "Página inicial do site da TPark Estacionamentos",
  },
  {
    id: "estudai",
    featured: true,
    index: "06",
    category: "App",
    title: "EstudAí",
    description: "Organização e rotina de estudos em uma experiência mobile.",
    image: "/assets/images/projects/estudai.webp",
    wallImage: "/assets/images/projects/wall/estudai.webp",
    aspect: 1600 / 1095,
    alt: "Apresentação do aplicativo EstudAí com a tela de acesso no celular",
  },
  {
    id: "mercearia",
    index: "07",
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
    index: "08",
    category: "Sistema",
    title: "ObraFlow",
    description: "Cronograma, equipe, custos e indicadores em um painel.",
    image: "/assets/images/projects/obraflow.webp",
    wallImage: "/assets/images/projects/wall/obraflow.webp",
    aspect: 1122 / 660,
    alt: "Interface do sistema de gestão de obras ObraFlow",
  },
  {
    id: "brisa",
    featured: true,
    index: "09",
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
    featured: true,
    index: "10",
    category: "Design",
    title: "Serra Labs",
    description: "Identidade para consultoria em tecnologia e IA.",
    image: "/assets/images/projects/serra-labs.webp",
    wallImage: "/assets/images/projects/wall/serra-labs.webp",
    aspect: 1122 / 1402,
    alt: "Kit de identidade visual da Serra Labs",
  },
  {
    id: "aurora",
    featured: true,
    index: "11",
    category: "Design",
    title: "Aurora Casa",
    description: "Identidade para interiores e decoração.",
    image: "/assets/images/projects/aurora-casa.webp",
    wallImage: "/assets/images/projects/wall/aurora-casa.webp",
    aspect: 1122 / 1402,
    alt: "Kit de identidade visual da Aurora Casa",
  },
];

// Video no card: toca sem som e em loop so enquanto o card esta visivel, para nao
// pesar a pagina. Com movimento reduzido nao ha autoplay; a capa fica parada. O
// som e os controles ficam no modal.
function TileVideo({ project, reducedMotion }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={videoRef}
      src={project.video}
      poster={project.image}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}

// Posicao do cursor no card, em %, para o brilho do hover seguir o mouse.
function seguirCursor(event) {
  const card = event.currentTarget;
  const caixa = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${((event.clientX - caixa.left) / caixa.width) * 100}%`);
  card.style.setProperty("--my", `${((event.clientY - caixa.top) / caixa.height) * 100}%`);
}

// No grid o card mostra so a arte; nome, tag e descricao aparecem no modal, que o
// botao invisivel por cima do card abre.
function BentoTile({ project, reducedMotion, style, onOpen, destaque }) {
  return (
    <motion.article
      className={`bento-tile bento-tile-${project.id}`}
      id={`projeto-${project.id}`}
      data-destaque={destaque}
      style={style}
      onPointerMove={seguirCursor}
      layout={!reducedMotion}
      initial={reducedMotion ? false : entrada.initial}
      animate={entrada.animate}
      exit={reducedMotion ? undefined : entrada.exit}
      transition={entrada.transition}
    >
      {project.video ? (
        <TileVideo project={project} reducedMotion={reducedMotion} />
      ) : (
        <img src={project.image} alt="" loading="eager" decoding="async" />
      )}
      <button
        className="bento-tile-open"
        type="button"
        aria-haspopup="dialog"
        aria-label={`Ver ${project.title}`}
        onClick={() => onOpen(project)}
      />
    </motion.article>
  );
}

// Modal do projeto, no centro da tela: em cima a tag, o nome e a descricao; embaixo
// a arte inteira, na proporcao dela. Usa <dialog> nativo: prende o foco, fecha no Esc e
// fica acima de tudo. Clicar fora do painel (no fundo) tambem fecha; ao fechar, o
// foco volta para o card que abriu.
function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!project) {
      if (dialog.open) dialog.close();
      return undefined;
    }

    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = overflow;
    };
  }, [project]);

  return (
    <dialog
      ref={dialogRef}
      className="project-modal"
      aria-labelledby="project-modal-title"
      style={project ? { "--ratio": project.aspect } : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <div className="project-modal-panel">
          <header className="project-modal-head">
            <div className="project-modal-info">
              <span className="project-modal-tag">
                <span>{project.index}</span>
                {project.category}
              </span>
              <h3 id="project-modal-title">{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <button
              className="project-modal-close"
              type="button"
              aria-label="Fechar"
              onClick={onClose}
            >
              <BsXLg aria-hidden="true" />
            </button>
          </header>
          <div className="project-modal-media">
            {project.video ? (
              <video
                src={project.video}
                poster={project.image}
                controls
                autoPlay
                playsInline
                aria-label={project.alt}
              />
            ) : (
              <img src={project.image} alt={project.alt} />
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

// Destaque em linhas justificadas: cada card ocupa uma fatia da linha proporcional
// a proporcao da propria imagem. Como todos tem `aspect-ratio` igual ao da arte,
// os cards de uma linha saem com a mesma altura e nenhuma imagem e cortada nem
// distorcida; a linha inteira escala por igual com a largura da tela.
//
// A altura de uma linha e a largura dividida pela soma das proporcoes, entao fechar
// cada linha quando a soma passa de um alvo deixa as linhas com alturas parecidas:
// duas artes 16:9 somam ~3,5, e quatro artes em pe (0,8 a 1) somam ~3,4. No tablet
// a linha e mais estreita e o alvo cai para pares; no celular e um card por linha.
const SOMA_DESKTOP = 3;

function agruparLinhas(lista, alvo) {
  const linhas = [[]];
  let soma = 0;
  lista.forEach((project) => {
    if (soma >= alvo) {
      linhas.push([]);
      soma = 0;
    }
    linhas[linhas.length - 1].push(project);
    soma += project.aspect;
  });
  // Sobra curta no fim (menos da metade do alvo) ficaria sozinha e enorme: junta
  // na linha anterior.
  if (linhas.length > 1 && soma < alvo / 2) {
    const sobra = linhas.pop();
    linhas[linhas.length - 1].push(...sobra);
  }
  return linhas;
}

function fatias(linhas) {
  const porId = {};
  linhas.forEach((linha) => {
    const soma = linha.reduce((total, project) => total + project.aspect, 0);
    linha.forEach((project) => {
      porId[project.id] = { fatia: project.aspect / soma, vaos: linha.length - 1 };
    });
  });
  return porId;
}

// Estilo de cada card, em qualquer aba. No destaque, o Morcegao e os videos da
// pilha so precisam da proporcao (a primeira linha tem medidas proprias no CSS);
// os demais recebem a fatia da linha no tablet (pares) e no desktop (soma alvo).
// Nas outras abas todos entram nas linhas. No tablet, um card que sobraria
// sozinho no fim e estreito (em pe ou quadrado) junta no par anterior.
function linhasJustificadas(lista, emDestaque) {
  const fixo = (project) => emDestaque && project.destaque;
  const livres = lista.filter((project) => !fixo(project));
  const pares = [];
  for (let i = 0; i < livres.length; i += 2) pares.push(livres.slice(i, i + 2));
  const ultimo = pares[pares.length - 1];
  if (pares.length > 1 && ultimo.length === 1 && ultimo[0].aspect < 1.2) {
    pares[pares.length - 2].push(...pares.pop());
  }
  const tablet = fatias(pares);
  const desktop = fatias(agruparLinhas(livres, SOMA_DESKTOP));

  return Object.fromEntries(
    lista.map((project) => [
      project.id,
      fixo(project)
        ? { "--ratio": project.aspect }
        : {
            "--ratio": project.aspect,
            "--share-md": tablet[project.id].fatia,
            "--gaps-md": tablet[project.id].vaos,
            "--share-lg": desktop[project.id].fatia,
            "--gaps-lg": desktop[project.id].vaos,
          },
    ]),
  );
}

// No destaque os videos da pilha viram um bloco so, na posicao do primeiro deles.
function blocosDoDestaque(lista) {
  const pilha = lista.filter((project) => project.destaque === "pilha");
  const blocos = [];
  lista.forEach((project) => {
    if (project.destaque !== "pilha") blocos.push(project);
    else if (project === pilha[0]) blocos.push({ pilha });
  });
  return blocos;
}

export function RecentProjects() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState("destaque");
  const [aberto, setAberto] = useState(null);

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
  const estilos = useMemo(
    () => linhasJustificadas(visiveis, emDestaque),
    [emDestaque, visiveis],
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
            {(emDestaque ? blocosDoDestaque(visiveis) : visiveis).map((bloco) =>
              bloco.pilha ? (
                <motion.div
                  className="bento-stack"
                  key="pilha"
                  layout={!reducedMotion}
                  initial={reducedMotion ? false : entrada.initial}
                  animate={entrada.animate}
                  exit={reducedMotion ? undefined : entrada.exit}
                  transition={entrada.transition}
                >
                  {bloco.pilha.map((project) => (
                    <BentoTile
                      project={project}
                      reducedMotion={reducedMotion}
                      style={estilos[project.id]}
                      destaque={project.destaque}
                      onOpen={setAberto}
                      key={project.id}
                    />
                  ))}
                </motion.div>
              ) : (
                <BentoTile
                  project={bloco}
                  reducedMotion={reducedMotion}
                  style={estilos[bloco.id]}
                  destaque={emDestaque ? bloco.destaque : undefined}
                  onOpen={setAberto}
                  key={bloco.id}
                />
              ),
            )}
          </AnimatePresence>
        </div>

        <ProjectModal project={aberto} onClose={() => setAberto(null)} />

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
