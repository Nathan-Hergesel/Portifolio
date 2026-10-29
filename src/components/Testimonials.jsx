"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import { MessageSquareCode } from "./animate-ui/icons/message-square-code";
import { Star } from "./animate-ui/icons/star";
import { Terminal } from "./animate-ui/icons/terminal";
import { testimonials } from "../data/site";

const easeOutExpo = [0.16, 1, 0.3, 1];

const reveal = {
  rest: { y: 24 },
  visible: {
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

// Mesmos icones do filtro de projetos, para o tipo de trabalho ser lido igual
// nas duas secoes.
const PROJECT_ICONS = {
  vjs: { Icon: MessageSquareCode },
  morcegao: { Icon: Terminal },
};

const pad = (value) => String(value).padStart(2, "0");

const initials = (name) =>
  name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export function Testimonials() {
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const testimonial = testimonials[current];
  const total = testimonials.length;

  const go = (step) => setCurrent((index) => (index + step + total) % total);

  return (
    <section className="testimonials section" id="depoimentos" aria-labelledby="testimonials-title">
      <motion.header
        className="chapter-intro"
        variants={reveal}
        initial={reducedMotion ? false : "rest"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="chapter-code">
          <Star
            size={16}
            strokeWidth={2.3}
            animate={!reducedMotion}
            loop={!reducedMotion}
            loopDelay={2800}
            aria-hidden="true"
          />
          04 / Depoimentos
        </span>
        <h2 id="testimonials-title">
          Palavra
          <br />
          de cliente<span>.</span>
        </h2>
      </motion.header>

      <div className="testimonial-stage">
        {/* Sem rotacao automatica: o texto so muda quando a pessoa pede, entao o
            aviso ao leitor de tela acompanha uma acao dela. */}
        <div className="testimonial-card" aria-live="polite">
          <span className="testimonial-mark" aria-hidden="true">
            “
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              className="testimonial"
              key={testimonial.id}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.42, ease: easeOutExpo }}
            >
              <blockquote>
                <p>{testimonial.quote}</p>
              </blockquote>
              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">
                  {initials(testimonial.author)}
                </span>
                <span>
                  <strong>{testimonial.author}</strong>
                  <small>{testimonial.role}</small>
                </span>
                <span className="testimonial-project">{testimonial.project}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="testimonial-controls">
          <div className="testimonial-picker" role="group" aria-label="Escolher depoimento">
            {testimonials.map((item, index) => {
              const { Icon, animation } = PROJECT_ICONS[item.id];
              const selected = index === current;

              return (
                <button
                  className="testimonial-chip"
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCurrent(index)}
                  key={item.id}
                >
                  <Icon
                    size={18}
                    strokeWidth={2.2}
                    animation={animation}
                    animate={selected && !reducedMotion}
                    loop={selected && !reducedMotion}
                    loopDelay={1800}
                    aria-hidden="true"
                  />
                  {item.author}
                  <span>{pad(index + 1)}</span>
                </button>
              );
            })}
          </div>

          <div className="testimonial-arrows">
            <span className="testimonial-count" aria-hidden="true">
              {pad(current + 1)} / {pad(total)}
            </span>
            <button type="button" onClick={() => go(-1)} aria-label="Depoimento anterior">
              <BsArrowLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Próximo depoimento">
              <BsArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
