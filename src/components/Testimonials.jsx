"use client";

import { motion, useReducedMotion } from "motion/react";
import { BsArrowUpRight } from "react-icons/bs";

import { Star } from "./animate-ui/icons/star";
import { Marquee } from "./ui/3d-testimonials";
import { testimonials } from "../data/site";

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

// Cada citacao vem seguida do print do projeto do mesmo cliente. Cada coluna leva
// uma janela de clientes e comeca num ponto diferente da lista, para as vizinhas
// nao andarem com os mesmos cartoes lado a lado e nenhuma ficar longa demais.
const PER_COLUMN = Math.min(4, testimonials.length);
const COLUMN_STARTS = [0, 4, 2, 6];
const COLUMN_DURATIONS = ["56s", "64s", "52s", "60s"];
const COLUMNS = COLUMN_STARTS.map((start) =>
  Array.from({ length: PER_COLUMN }, (_, offset) => {
    const testimonial = testimonials[(start + offset) % testimonials.length];
    return [
      { kind: "quote", testimonial },
      { kind: "shot", testimonial },
    ];
  }).flat(),
);

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

// Sem `loading="lazy"`: dentro do plano inclinado o navegador nem sempre percebe
// que o cartao entrou na tela, e ele ficava em branco. Sao poucas imagens, todas
// repetidas, entao o custo de carregar logo e baixo.
function ShotCard({ testimonial }) {
  // Pranchas de identidade tem margem branca; o recorte centralizado pega a peca.
  const board = testimonial.project === "Identidade visual";

  return (
    <div className={`wall-card wall-shot${board ? " is-board" : ""}`}>
      <img src={testimonial.shot} alt="" decoding="async" />
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
