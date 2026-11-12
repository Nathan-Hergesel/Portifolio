"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BsArrowUpRight } from "react-icons/bs";

import { Star } from "./animate-ui/icons/star";
import { testimonials } from "../data/site";
import { useMediaQuery } from "../hooks/useMediaQuery";

const easeOutExpo = [0.16, 1, 0.3, 1];

// So numeros sustentaveis. Entregues e anos vem de docs/INFO.md; clientes sao os
// do portfolio (VJS, Morcegao, TPark, Mercearia Facil, ObraFlow, Brisa Solar,
// Serra Labs e Aurora Casa). Atualizar aqui quando entrar cliente novo.
const METRICS = [
  { value: "10+", label: "projetos entregues" },
  { value: "8+", label: "clientes atendidos" },
  { value: "3+", label: "anos em projetos digitais" },
];

const reveal = {
  rest: { y: 24 },
  visible: {
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

// Duas iniciais; nome de uma palavra so ("ObraFlow") usa as duas primeiras letras.
const initials = (name) => {
  const words = name.split(" ").filter((word) => word.length > 2);
  const letters = words.length > 1 ? words.slice(0, 2).map((word) => word[0]).join("") : words[0].slice(0, 2);
  return letters.toUpperCase();
};

// Grade de cartoes inteiros em vez de marquee: um marquee sempre corta cartoes na
// borda enquanto desliza. Aqui cada vaga troca de depoimento no lugar, uma por vez,
// entao nenhum aparece cortado. Seis vagas no maximo; o CSS mostra 2, 4 ou 6.
const MAX_SLOTS = 6;
const SWAP_INTERVAL = 3200;

function useSlotCount() {
  const desktop = useMediaQuery("(min-width: 64rem)");
  const wide = useMediaQuery("(min-width: 100rem)");
  if (wide) return 6;
  return desktop ? 4 : 2;
}

function TestimonialGrid({ reducedMotion }) {
  const count = useSlotCount();
  const [slots, setSlots] = useState(() =>
    Array.from({ length: MAX_SLOTS }, (_, index) => index % testimonials.length),
  );
  const [paused, setPaused] = useState(false);
  const nextTestimonial = useRef(MAX_SLOTS % testimonials.length);
  const nextSlot = useRef(0);

  useEffect(() => {
    if (reducedMotion || paused || testimonials.length <= count) return undefined;

    const timer = window.setInterval(() => {
      setSlots((current) => {
        // Proximo depoimento que nao esteja visivel, para nao repetir lado a lado.
        const visible = current.slice(0, count);
        let candidate = nextTestimonial.current;
        while (visible.includes(candidate)) candidate = (candidate + 1) % testimonials.length;
        nextTestimonial.current = (candidate + 1) % testimonials.length;

        const slot = nextSlot.current % count;
        nextSlot.current = slot + 1;

        const updated = [...current];
        updated[slot] = candidate;
        return updated;
      });
    }, SWAP_INTERVAL);

    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion]);

  return (
    <div
      className="testimonial-wall"
      aria-hidden="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testimonial-grid">
        {slots.map((index, slot) => {
          const testimonial = testimonials[index];

          return (
            <div className="testimonial-slot" key={slot}>
              {/* `wait`: o cartao que sai some antes do novo entrar, sem os dois
                  textos sobrepostos no meio da troca. */}
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  className="testimonial-slot-card"
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
                >
                  <QuoteCard testimonial={testimonial} />
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Tom do avatar fixo por cliente (pela posicao na lista), para a mesma empresa ter
// sempre a mesma cor em qualquer coluna. Quatro tons, ciclando.
const AVATAR_TONES = 4;
const toneOf = (testimonial) => testimonials.indexOf(testimonial) % AVATAR_TONES;

function QuoteCard({ testimonial }) {
  return (
    <figure className="wall-card wall-quote">
      <span className="wall-quote-mark">“</span>
      <blockquote>
        <p>{testimonial.quote}</p>
      </blockquote>
      <figcaption>
        <span className="testimonial-avatar" data-tone={toneOf(testimonial)}>
          {initials(testimonial.author)}
        </span>
        <span>
          <strong>{testimonial.author}</strong>
          <small>{testimonial.role}</small>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const reducedMotion = useReducedMotion();

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
        <p className="chapter-lede">
          O que fica depois da entrega, nas palavras de quem contratou.
        </p>

        <dl className="testimonial-metrics">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>

        <a className="chapter-cta testimonial-cta" href="#contato">
          Quero ser o próximo
          <BsArrowUpRight aria-hidden="true" />
        </a>
      </motion.header>

      {/* A grade troca de conteudo sozinha, entao e decorativa para leitores de
          tela, que recebem todos os depoimentos de uma vez na lista abaixo. */}
      <TestimonialGrid reducedMotion={reducedMotion} />

      <ul className="sr-only">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <figure>
              <blockquote>
                <p>{testimonial.quote}</p>
              </blockquote>
              <figcaption>
                {testimonial.author}, {testimonial.role} ({testimonial.project})
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
