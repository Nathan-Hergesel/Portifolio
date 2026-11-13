"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BsArrowUpRight, BsEnvelope, BsWhatsapp } from "react-icons/bs";

import { Brush } from "./animate-ui/icons/brush";
import { Clapperboard } from "./animate-ui/icons/clapperboard";
import { Layers } from "./animate-ui/icons/layers";
import { Lightbulb } from "./animate-ui/icons/lightbulb";
import { MessageSquareCode } from "./animate-ui/icons/message-square-code";
import { Send } from "./animate-ui/icons/send";
import { Terminal } from "./animate-ui/icons/terminal";
import { contactChannels, projectTopics } from "../data/site";

// Mesmo vocabulario de icones do filtro de projetos; "Ainda nao sei" ganha a
// lampada, ja que a ideia ainda esta tomando forma.
const TOPIC_ICONS = {
  site: { Icon: MessageSquareCode },
  app: { Icon: Layers, animation: "default-loop" },
  sistema: { Icon: Terminal },
  identidade: { Icon: Brush },
  video: { Icon: Clapperboard },
  outro: { Icon: Lightbulb },
};

const easeOutExpo = [0.16, 1, 0.3, 1];

const reveal = {
  rest: { y: 24 },
  visible: {
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

const facts = [
  { value: "24h", label: "para o primeiro retorno" },
  { value: "10+", label: "projetos entregues" },
  { value: "BR + EXT", label: "clientes no Brasil e no exterior" },
];

export function ProjectCta() {
  const reducedMotion = useReducedMotion();
  const [topicId, setTopicId] = useState(projectTopics[0].id);
  const topic = projectTopics.find((item) => item.id === topicId);

  // O tipo escolhido segue na mensagem, para a conversa ja comecar com contexto.
  const message = `Olá, Nathan! Quero conversar sobre ${topic.message}.`;
  const whatsappHref = `https://wa.me/${contactChannels.whatsapp}?text=${encodeURIComponent(message)}`;
  const emailHref = `mailto:${contactChannels.email}?subject=${encodeURIComponent(
    `Novo projeto: ${topic.label}`,
  )}&body=${encodeURIComponent(`${message}\n\n`)}`;

  return (
    <section className="project-cta section" id="contato" aria-labelledby="cta-title">
      <motion.div
        className="cta-heading"
        variants={reveal}
        initial={reducedMotion ? false : "rest"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="chapter-code">
          <Send
            size={16}
            strokeWidth={2.3}
            animate={!reducedMotion}
            loop={!reducedMotion}
            loopDelay={2400}
            aria-hidden="true"
          />
          05 / Próximo projeto
        </span>
        <h2 id="cta-title">
          Tem uma ideia?
          <br />
          Vamos <span className="cta-keep">fazê-la</span>
          <br />
          encaixar<span className="cta-dot">.</span>
        </h2>
      </motion.div>

      <div className="cta-panel">
        <p className="cta-lede">
          Conte o contexto. Eu retorno com perguntas, possibilidades e um próximo passo claro.
        </p>

        <fieldset className="cta-topics">
          <legend>O que vamos criar?</legend>
          <div>
            {projectTopics.map((item) => {
              const { Icon, animation } = TOPIC_ICONS[item.id];
              const selected = item.id === topicId;

              return (
                <button
                  className="cta-topic"
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTopicId(item.id)}
                  key={item.id}
                >
                  <Icon
                    size={18}
                    strokeWidth={2.2}
                    animation={animation}
                    animate={selected && !reducedMotion}
                    loop={selected && !reducedMotion}
                    loopDelay={1600}
                    aria-hidden="true"
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="cta-actions">
          <a className="cta-primary" href={whatsappHref} target="_blank" rel="noreferrer">
            <BsWhatsapp aria-hidden="true" />
            <span>
              <strong>Começar pelo WhatsApp</strong>
              <small>{contactChannels.whatsappLabel}</small>
            </span>
            <BsArrowUpRight className="cta-arrow" aria-hidden="true" />
          </a>
          <a className="cta-secondary" href={emailHref}>
            <BsEnvelope aria-hidden="true" />
            <span>
              <strong>Prefiro e-mail</strong>
              <small>{contactChannels.email}</small>
            </span>
            <BsArrowUpRight className="cta-arrow" aria-hidden="true" />
          </a>
        </div>

        <dl className="cta-facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
