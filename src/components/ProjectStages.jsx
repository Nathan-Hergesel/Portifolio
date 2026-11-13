"use client";

import { motion, useReducedMotion } from "motion/react";
import { BsArrowUpRight } from "react-icons/bs";

import { BadgeCheck } from "./animate-ui/icons/badge-check";
import { Compass } from "./animate-ui/icons/compass";
import { Layers } from "./animate-ui/icons/layers";
import { MessageSquare } from "./animate-ui/icons/message-square";
import { Route } from "./animate-ui/icons/route";
import { Send } from "./animate-ui/icons/send";
import { ExpandingCards } from "./ui/expanding-cards";
import { projectStages } from "../data/site";

const easeOutExpo = [0.16, 1, 0.3, 1];

const reveal = {
  rest: { y: 24 },
  visible: {
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

const STAGE_ICONS = {
  briefing: { Icon: MessageSquare },
  planejamento: { Icon: Compass, animation: "default-loop" },
  producao: { Icon: Layers, animation: "default-loop" },
  validacao: { Icon: BadgeCheck },
  entrega: { Icon: Send },
};

// Conteudo de um card de etapa. Fechado, mostra o numero, o icone (parado) e o
// nome na vertical; aberto, ganha o fundo azul da marca, o icone anima uma vez e
// aparecem o prazo, o resumo e o que cada lado faz. O texto do card aberto fica sempre no DOM (so some visualmente nos
// fechados), entao leitores de tela leem todas as etapas.
function StageCard({ stage, active, reducedMotion }) {
  const { Icon, animation } = STAGE_ICONS[stage.id];

  return (
    <article className="stage-card" aria-labelledby={`etapa-${stage.id}`}>
      <span className="stage-card-glow" aria-hidden="true" />
      <span className="stage-card-number" aria-hidden="true">
        {stage.index}
      </span>

      <div className="stage-card-rail" aria-hidden="true">
        <span className="stage-card-index">{stage.index}</span>
        <Icon size={22} strokeWidth={2.2} />
        <span className="stage-card-vertical">{stage.title}</span>
      </div>

      <div className="stage-card-body">
        <header className="stage-card-head">
          <span className="stage-card-icon">
            <Icon
              size={28}
              strokeWidth={2.2}
              animation={animation}
              animate={active && !reducedMotion}
              aria-hidden="true"
            />
          </span>
          <span className="stage-card-chip">
            <b>{stage.index}</b> Etapa
          </span>
          <span className="stage-duration">{stage.duration}</span>
        </header>

        <h3 id={`etapa-${stage.id}`}>{stage.title}</h3>
        <p className="stage-card-summary">{stage.summary}</p>

        <dl className="stage-facts">
          <div>
            <dt>Você recebe</dt>
            <dd>
              <ul>
                {stage.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Sua parte</dt>
            <dd>{stage.clientRole}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export function ProjectStages() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="stages section"
      id="etapas"
      data-nav="processo"
      aria-labelledby="stages-title"
    >
      <motion.header
        className="chapter-intro chapter-intro-split"
        variants={reveal}
        initial={reducedMotion ? false : "rest"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div>
          <span className="chapter-code">
            <Route
              size={16}
              strokeWidth={2.3}
              animation="default-loop"
              animate={!reducedMotion}
              loop={!reducedMotion}
              loopDelay={2400}
              aria-hidden="true"
            />
            03 / Etapas do projeto
          </span>
          <h2 id="stages-title">
            Cinco etapas,
            <br />
            um caminho<span>.</span>
          </h2>
        </div>
        <p className="chapter-lede">
          Da primeira conversa ao lançamento. Em cada etapa você recebe algo concreto e
          decide antes de seguir, sem atalho escondido nem surpresa no caminho.
        </p>
      </motion.header>

      <ExpandingCards
        className="stage-cards"
        items={projectStages}
        aria-label="Etapas do projeto"
        renderCard={(stage, { active }) => (
          <StageCard stage={stage} active={active} reducedMotion={reducedMotion} />
        )}
      />

      <footer className="stages-outro">
        <p>
          Prazos de referência para um site institucional. Cada proposta traz um cronograma
          próprio, ajustado ao escopo.
        </p>
        <a className="chapter-cta" href="#contato">
          Começar pelo briefing
          <BsArrowUpRight aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
