"use client";

import { motion, useReducedMotion } from "motion/react";

import { Star } from "./animate-ui/icons/star";
import { Marquee } from "./ui/3d-testimonials";
import { testimonials } from "../data/site";

const easeOutExpo = [0.16, 1, 0.3, 1];

const reveal = {
  rest: { y: 24 },
  visible: {
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

const initials = (name) =>
  name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

// Com poucos depoimentos, cada citacao divide o mural com o print do projeto do
// mesmo cliente. Cada coluna comeca num ponto diferente da sequencia, para as
// vizinhas nao andarem com os mesmos cartoes lado a lado.
const SEQUENCE = testimonials.flatMap((testimonial) => [
  { kind: "quote", testimonial },
  { kind: "shot", testimonial },
]);
const COLUMN_OFFSETS = [0, 2, 1, 3];
const COLUMN_DURATIONS = ["44s", "52s", "40s", "48s"];
const COLUMNS = COLUMN_OFFSETS.map((offset) =>
  SEQUENCE.map((_, index) => SEQUENCE[(index + offset) % SEQUENCE.length]),
);

function QuoteCard({ testimonial }) {
  return (
    <figure className="wall-card wall-quote">
      <span className="wall-quote-mark">“</span>
      <blockquote>
        <p>{testimonial.quote}</p>
      </blockquote>
      <figcaption>
        <span className="testimonial-avatar">{initials(testimonial.author)}</span>
        <span>
          <strong>{testimonial.author}</strong>
          <small>{testimonial.role}</small>
        </span>
      </figcaption>
    </figure>
  );
}

function ShotCard({ testimonial }) {
  return (
    <div className="wall-card wall-shot">
      <img src={testimonial.shot} alt="" loading="lazy" decoding="async" />
      <span>
        {testimonial.author} · {testimonial.project}
      </span>
    </div>
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
      </motion.header>

      {/* Mural em perspectiva: as colunas repetem os cartoes para o loop fechar,
          entao ele e decorativo para leitores de tela, que recebem a lista abaixo
          uma vez so. */}
      <div className="testimonial-wall" aria-hidden="true">
        <div className="testimonial-wall-tilt">
          {COLUMNS.map((column, index) => (
            <Marquee
              vertical
              pauseOnHover
              reverse={index % 2 === 1}
              repeat={3}
              className="testimonial-wall-col"
              style={{ "--duration": COLUMN_DURATIONS[index] }}
              key={index}
            >
              {column.map(({ kind, testimonial }) =>
                kind === "quote" ? (
                  <QuoteCard testimonial={testimonial} key={`quote-${testimonial.id}`} />
                ) : (
                  <ShotCard testimonial={testimonial} key={`shot-${testimonial.id}`} />
                ),
              )}
            </Marquee>
          ))}
        </div>
      </div>

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
