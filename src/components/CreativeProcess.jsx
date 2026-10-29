"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

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
  refinar: { Icon: Sparkles, cursor: [80, 70] },
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
              <span className="studio-final" data-on={active === 3}>
                <img
                  src="/assets/images/projects/vjs-sistemas.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </span>
            <span className="studio-approved" data-on={active === 3}>
              Aprovado
            </span>
          </div>

          <StudioCursor position={TOOLS[mode.id].cursor} />
        </div>
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
  const stepRefs = useRef([]);

  useEffect(() => {
    // Faixa estreita logo abaixo do meio da tela: a etapa ativa e a que esta sendo
    // lida, nao a primeira que encosta na borda. Abaixo do meio porque no celular o
    // estudio fixo ocupa a metade de cima.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-58% 0px -38%", threshold: 0 },
    );

    stepRefs.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

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

      <div className="creative-layout">
        <ol className="creative-steps">
          {creativeModes.map((mode, index) => {
            const { Icon } = TOOLS[mode.id];
            const on = index === active;

            return (
              <li
                className="creative-step"
                data-index={index}
                data-active={on}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                key={mode.id}
              >
                <span className="creative-step-chip">
                  <Icon
                    size={18}
                    strokeWidth={2.2}
                    animate={on && !reducedMotion}
                    loop={on && !reducedMotion}
                    loopDelay={1600}
                    aria-hidden="true"
                  />
                  {mode.index}
                </span>
                <h3>{mode.verb}</h3>
                <p className="creative-step-lead">{mode.lead}</p>
                <p>{mode.description}</p>
                <ul>
                  {mode.artifacts.map((artifact) => (
                    <li key={artifact}>{artifact}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        <div className="creative-stage">
          <Studio active={active} reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
}
