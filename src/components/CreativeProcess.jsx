"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Brush } from "./animate-ui/icons/brush";
import { GalleryHorizontal } from "./animate-ui/icons/gallery-horizontal";
import { Lightbulb } from "./animate-ui/icons/lightbulb";
import { MessageCircle } from "./animate-ui/icons/message-circle";
import { Sparkles } from "./animate-ui/icons/sparkles";
import { creativeModes } from "../data/site";

const easeOutExpo = [0.16, 1, 0.3, 1];

const reveal = {
  rest: { y: 24 },
  visible: {
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

// Uma ferramenta por modo, na mesma ordem de `creativeModes`. `cursor` e onde o
// ponteiro do estudio para em cada modo, em % da area de trabalho.
const TOOLS = {
  escutar: { Icon: MessageCircle, cursor: [74, 78] },
  referenciar: { Icon: GalleryHorizontal, cursor: [34, 44] },
  esbocar: { Icon: Brush, cursor: [58, 30] },
  refinar: { Icon: Sparkles, cursor: [64, 56] },
};

const CHAT = [
  { from: "client", text: "Preciso que o site venda mais." },
  { from: "me", text: "Quem compra hoje? E por onde chega?" },
  { from: "client", text: "Pequenos comércios, pelo Instagram." },
  { from: "me", text: "Então a jornada começa por lá." },
];

// Paleta generica de exemplo, de proposito fora das cores da marca do site.
const PALETTE = ["#264653", "#2A9D8F", "#E9C46A", "#E76F51"];

function StudioCursor({ position }) {
  return (
    <span
      className="studio-cursor"
      style={{ "--cx": `${position[0]}%`, "--cy": `${position[1]}%` }}
    >
      <svg viewBox="0 0 32 32" width="22" height="22">
        <path d="M3 1.75v24.3l6.35-6.15 5.45 10.35 5-2.65-5.15-9.75h9.1L3 1.75Z" />
      </svg>
      <span>Nathan</span>
    </span>
  );
}

function Inspector({ mode, reducedMotion }) {
  const { Icon } = TOOLS[mode.id];

  return (
    <div className="studio-inspector">
      <span className="studio-inspector-label">Propriedades</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="studio-inspector-body"
          key={mode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
        >
          <span className="inspector-chip">
            <Icon
              size={18}
              strokeWidth={2.2}
              animate={!reducedMotion}
              loop={!reducedMotion}
              loopDelay={1600}
            />
            {mode.index} / {String(creativeModes.length).padStart(2, "0")}
          </span>
          <h3>{mode.verb}</h3>
          <p className="inspector-lead">{mode.lead}</p>
          <p className="inspector-text">{mode.description}</p>
          <ul>
            {mode.artifacts.map((artifact) => (
              <li key={artifact}>{artifact}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Studio({ active, reducedMotion }) {
  const mode = creativeModes[active];

  return (
    <div className="studio" aria-hidden="true">
      <div className="studio-bar">
        <span className="studio-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="studio-file">
          seu-projeto <b>/ {mode.verb.toLowerCase()}</b>
        </span>
        <span className="studio-count">
          {mode.index}/{String(creativeModes.length).padStart(2, "0")}
        </span>
      </div>

      <div className="studio-body">
        <div className="studio-tools">
          {creativeModes.map((item, index) => {
            const { Icon } = TOOLS[item.id];
            const on = index === active;

            return (
              <span className="studio-tool" data-on={on} key={item.id}>
                <Icon
                  size={18}
                  strokeWidth={2.2}
                  animate={on && !reducedMotion}
                  loop={on && !reducedMotion}
                  loopDelay={1400}
                />
              </span>
            );
          })}
        </div>

        <div className="studio-canvas">
          <div className="studio-layer studio-chat" data-on={active === 0}>
            {CHAT.map((line) => (
              <span className={`chat-bubble chat-${line.from}`} key={line.text}>
                {line.text}
              </span>
            ))}
          </div>

          {/* Moodboard no formato classico (foto, forma, tipografia, paleta,
              componentes e palavras-chave), com pecas genericas: e o metodo que
              aparece aqui, nao um trabalho especifico. */}
          <div className="studio-layer studio-mood" data-on={active === 1}>
            <span className="mood-photo">
              <i className="mood-sun" />
              <i className="mood-hill mood-hill-back" />
              <i className="mood-hill" />
            </span>
            <span className="mood-shapes">
              <i />
              <i />
              <i />
            </span>
            <span className="mood-type">
              Aa
              <small>
                Título
                <br />
                Corpo
              </small>
            </span>
            <span className="mood-palette">
              {PALETTE.map((hex) => (
                <span key={hex} style={{ "--swatch": hex }}>
                  {hex}
                </span>
              ))}
            </span>
            <span className="mood-ui">
              <span className="mood-ui-button">Botão</span>
              <span className="mood-ui-toggle" />
              <span className="mood-ui-input" />
            </span>
            <span className="mood-tags">
              <span>direto</span>
              <span>humano</span>
              <span>preciso</span>
            </span>
          </div>

          {/* Esboco e refino dividem a mesma moldura: o refino passa por cima do
              wireframe como uma varredura, em vez de trocar de imagem. */}
          <div
            className="studio-layer studio-page"
            data-on={active >= 2}
            data-refined={active === 3}
          >
            <span className="studio-browser">
              <span className="studio-browser-bar">
                <i />
                <i />
                <i />
                <span />
              </span>
              <span className="studio-wire">
                <span className="wire-nav" />
                <span className="wire-hero">
                  <span className="wire-line wire-line-lg" />
                  <span className="wire-line wire-line-md" />
                  <span className="wire-button" />
                  <span className="wire-media" />
                </span>
                <span className="wire-cards">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              {/* Site final desenhado, nao um print: e o moodboard aplicado (mesma
                  paleta, a ilustracao da foto, botoes em pilula) sobre o mesmo
                  esqueleto do wireframe. */}
              <span className="studio-final" data-on={active === 3}>
                <span className="mock-nav">
                  <span className="mock-logo">
                    <i />
                    Sua marca
                  </span>
                  <span className="mock-links">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="mock-cta">Contato</span>
                </span>
                <span className="mock-hero">
                  <span className="mock-copy">
                    <span className="mock-tag">Novo</span>
                    <span className="mock-title">Seu negócio pronto para crescer.</span>
                    <span className="mock-text">
                      <i />
                      <i />
                    </span>
                    <span className="mock-actions">
                      <span className="mock-button">Começar</span>
                      <span className="mock-link">Saiba mais</span>
                    </span>
                  </span>
                  <span className="mock-art">
                    <i className="mock-sun" />
                    <i className="mock-hill mock-hill-back" />
                    <i className="mock-hill" />
                  </span>
                </span>
                <span className="mock-cards">
                  {PALETTE.slice(1).map((hex) => (
                    <span key={hex} style={{ "--accent": hex }}>
                      <i />
                      <b />
                      <b />
                    </span>
                  ))}
                </span>
              </span>
            </span>
            <span className="studio-approved" data-on={active === 3}>
              Aprovado
            </span>
          </div>

          <StudioCursor position={TOOLS[mode.id].cursor} />
        </div>

        {/* Painel de propriedades, como nas ferramentas de design: e aqui que o
            texto da etapa aparece, no canto do estudio. */}
        <Inspector mode={mode} reducedMotion={reducedMotion} />
      </div>

      <ol className="studio-timeline">
        {creativeModes.map((item, index) => (
          <li data-on={index === active} data-done={index < active} key={item.id}>
            {item.verb}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CreativeProcess() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const markerRefs = useRef([]);

  useEffect(() => {
    // Cada etapa tem um marcador invisivel cobrindo sua fatia da altura de rolagem.
    // A etapa ativa e a do marcador que esta passando pela faixa do meio da tela.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-49% 0px -49%", threshold: 0 },
    );

    markerRefs.current.forEach((marker) => marker && observer.observe(marker));
    return () => observer.disconnect();
  }, []);

  const share = 100 / creativeModes.length;

  return (
    <section className="creative section" id="processo" aria-labelledby="creative-title">
      <motion.header
        className="chapter-intro"
        variants={reveal}
        initial={reducedMotion ? false : "rest"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="chapter-code">
          <Lightbulb
            size={16}
            strokeWidth={2.3}
            animate={!reducedMotion}
            loop={!reducedMotion}
            loopDelay={2600}
            aria-hidden="true"
          />
          02 / Processo criativo
        </span>
        <h2 id="creative-title">
          Da ideia
          <br />
          ao detalhe<span>.</span>
        </h2>
        <p className="chapter-lede">
          Criatividade aqui não é inspiração repentina. É um método: ouvir com atenção, reunir
          repertório, testar caminhos e lapidar o escolhido.
        </p>
      </motion.header>

      {/* Trilho de rolagem: o estudio fica preso na tela ocupando a largura toda
          enquanto a rolagem passa pelos marcadores de cada etapa. */}
      <div className="creative-scroll" style={{ "--steps": creativeModes.length }}>
        {creativeModes.map((mode, index) => (
          <span
            className="creative-marker"
            data-index={index}
            style={{ top: `${index * share}%`, height: `${share}%` }}
            ref={(node) => {
              markerRefs.current[index] = node;
            }}
            aria-hidden="true"
            key={mode.id}
          />
        ))}

        <div className="creative-sticky">
          <Studio active={active} reducedMotion={reducedMotion} />
        </div>
      </div>

      {/* O estudio mostra uma etapa por vez; leitores de tela recebem todas aqui. */}
      <ol className="sr-only">
        {creativeModes.map((mode) => (
          <li key={mode.id}>
            <h3>
              {mode.index}. {mode.verb}: {mode.lead}
            </h3>
            <p>{mode.description}</p>
            <p>{mode.artifacts.join(", ")}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
