"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { BsArrowUpRight } from "react-icons/bs";

import { BadgeCheck } from "./animate-ui/icons/badge-check";
import { Compass } from "./animate-ui/icons/compass";
import { Layers } from "./animate-ui/icons/layers";
import { MapPin } from "./animate-ui/icons/map-pin";
import { MessageSquare } from "./animate-ui/icons/message-square";
import { Route } from "./animate-ui/icons/route";
import { projectStages } from "../data/site";
import { useMediaQuery } from "../hooks/useMediaQuery";

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
  entrega: { Icon: MapPin },
};

/* --- Geometria da trilha ---------------------------------------------------
   O mapa ocupa a secao inteira, entao a proporcao da area muda com a janela.
   Em vez de esticar um viewBox fixo (o que deformaria traco e relevo), as
   paradas ficam em coordenadas normalizadas e a trilha e recalculada em pixels
   no tamanho real. Entre duas paradas a trilha e uma Bezier cubica que sai e
   chega na horizontal, o que da o serpenteio. Viajante, desenho da trilha e
   etapa ativa saem todos da mesma tabela de amostras. */

const STOPS = [
  [0.07, 0.74],
  [0.29, 0.26],
  [0.5, 0.68],
  [0.71, 0.22],
  [0.9, 0.58],
];

// Ilhas de relevo: centro e raio normalizados pela largura; `squash` achata.
const ISLANDS = [
  { x: 0.18, y: 0.5, r: 0.11, squash: 0.5, rotate: -12 },
  { x: 0.6, y: 0.42, r: 0.13, squash: 0.48, rotate: 8 },
  { x: 0.84, y: 0.86, r: 0.1, squash: 0.42, rotate: -6 },
  { x: 0.4, y: 0.1, r: 0.07, squash: 0.45, rotate: 4 },
];

const bezierPoint = ([p0, p1, p2, p3], t) => {
  const u = 1 - t;
  return [0, 1].map(
    (axis) =>
      u * u * u * p0[axis] +
      3 * u * u * t * p1[axis] +
      3 * u * t * t * p2[axis] +
      t * t * t * p3[axis],
  );
};

function buildTrail(width, height) {
  const waypoints = STOPS.map(([x, y]) => [x * width, y * height]);
  const segments = waypoints.slice(1).map((end, index) => {
    const start = waypoints[index];
    const handle = (end[0] - start[0]) * 0.45;
    return [start, [start[0] + handle, start[1]], [end[0] - handle, end[1]], end];
  });

  const d = `M${waypoints[0].join(" ")} ${segments
    .map(([, c1, c2, end]) => `C${c1.join(" ")} ${c2.join(" ")} ${end.join(" ")}`)
    .join(" ")}`;

  // Amostras com comprimento acumulado: transformam "fracao da trilha" em ponto.
  const points = [{ length: 0, x: waypoints[0][0], y: waypoints[0][1] }];
  const stopLengths = [0];
  segments.forEach((segment) => {
    for (let step = 1; step <= 64; step += 1) {
      const [x, y] = bezierPoint(segment, step / 64);
      const previous = points[points.length - 1];
      points.push({ length: previous.length + Math.hypot(x - previous.x, y - previous.y), x, y });
    }
    stopLengths.push(points[points.length - 1].length);
  });

  const total = points[points.length - 1].length;
  return { width, height, waypoints, d, points, total, stops: stopLengths.map((length) => length / total) };
}

const pointAt = (trail, fraction) => {
  const target = Math.min(Math.max(fraction, 0), 1) * trail.total;
  const index = trail.points.findIndex((point) => point.length >= target);
  if (index <= 0) return trail.points[0];
  const a = trail.points[index - 1];
  const b = trail.points[index];
  const t = (target - a.length) / (b.length - a.length || 1);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
};

const stageAt = (trail, fraction) =>
  trail.stops.reduce((found, stop, index) => (fraction >= stop - 0.004 ? index : found), 0);

// Rolagem -> trilha. Cada parada tem um trecho de pausa (o viajante fica parado
// enquanto o cartao e lido) e um trecho de caminhada ate a proxima.
const SCROLL_IN = [0, 0.08, 0.22, 0.3, 0.44, 0.52, 0.66, 0.74, 0.88, 1];
const DWELL_CENTER = [0.04, 0.26, 0.48, 0.7, 0.94];

const trailOutput = (stops) => [0, 0, ...stops.slice(1, -1).flatMap((stop) => [stop, stop]), 1, 1];

const interpolate = (value, input, output) => {
  if (value <= input[0]) return output[0];
  for (let index = 1; index < input.length; index += 1) {
    if (value <= input[index]) {
      const t = (value - input[index - 1]) / (input[index] - input[index - 1]);
      return output[index - 1] + (output[index] - output[index - 1]) * t;
    }
  }
  return output[output.length - 1];
};

function StageIcon({ stage, on, reducedMotion, size = 22 }) {
  const { Icon, animation } = STAGE_ICONS[stage.id];

  return (
    <Icon
      size={size}
      strokeWidth={2.2}
      animation={animation}
      animate={on && !reducedMotion}
      loop={on && !reducedMotion}
      loopDelay={1500}
      aria-hidden="true"
    />
  );
}

function StageFacts({ stage }) {
  return (
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
  );
}

function TreasureMap({ reducedMotion }) {
  const questRef = useRef(null);
  const stickyRef = useRef(null);
  const fieldRef = useRef(null);
  const trailRef = useRef(null);
  const [size, setSize] = useState(null);
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const travelerX = useMotionValue(0);
  const travelerY = useMotionValue(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(fieldRef.current);
    return () => observer.disconnect();
  }, []);

  const trail = useMemo(() => (size ? buildTrail(size.width, size.height) : null), [size]);

  // Janela de rolagem em que o mapa fica preso: do topo do bloco encostar sob o
  // cabecalho ate o fim do bloco encostar no fim da tela.
  const range = useCallback(() => {
    const quest = questRef.current;
    const stickyTop = parseFloat(getComputedStyle(stickyRef.current).top) || 0;
    const top = quest.getBoundingClientRect().top + window.scrollY;
    return { start: top - stickyTop, end: top + quest.offsetHeight - window.innerHeight };
  }, []);

  const update = useCallback(() => {
    const { start, end } = range();
    progress.set(Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1));
  }, [progress, range]);

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const travel = useTransform(progress, (value) =>
    trailRef.current ? interpolate(value, SCROLL_IN, trailOutput(trailRef.current.stops)) : 0,
  );

  const place = useCallback(
    (fraction) => {
      const current = trailRef.current;
      if (!current) return;
      const point = pointAt(current, fraction);
      travelerX.set(point.x);
      travelerY.set(point.y);
      setActive(stageAt(current, fraction));
    },
    [travelerX, travelerY],
  );

  useMotionValueEvent(travel, "change", place);

  // A trilha muda de forma no resize; o viajante e a etapa sao reposicionados
  // sem esperar a proxima rolagem.
  useEffect(() => {
    trailRef.current = trail;
    if (trail) place(interpolate(progress.get(), SCROLL_IN, trailOutput(trail.stops)));
  }, [trail, place, progress]);

  const jumpTo = (index) => {
    const { start, end } = range();
    window.scrollTo({ top: start + DWELL_CENTER[index] * (end - start) });
  };

  const stage = projectStages[active];
  const treasure = trail?.waypoints[trail.waypoints.length - 1];

  return (
    <div className="quest" ref={questRef}>
      <div className="quest-sticky" ref={stickyRef}>
        <div className="map" ref={fieldRef}>
          {trail && (
            <svg
              className="map-svg"
              viewBox={`0 0 ${trail.width} ${trail.height}`}
              aria-hidden="true"
            >
              {ISLANDS.map((island) => {
                const rx = island.r * trail.width;
                return (
                  <g
                    className="map-relief"
                    transform={`translate(${island.x * trail.width} ${island.y * trail.height}) rotate(${island.rotate})`}
                    key={island.x}
                  >
                    {[1, 0.74, 0.5, 0.28].map((scale) => (
                      <ellipse rx={rx * scale} ry={rx * island.squash * scale} key={scale} />
                    ))}
                  </g>
                );
              })}

              <g className="map-x" transform={`translate(${treasure[0] + 72} ${treasure[1] - 4})`}>
                <path d="M-20 -20 20 20M20 -20-20 20" />
              </g>

              <path className="map-trail" d={trail.d} />
              <motion.path className="map-trail-done" d={trail.d} style={{ pathLength: travel }} />
              <motion.circle className="map-traveler-ring" cx={travelerX} cy={travelerY} r="16" />
              <motion.circle className="map-traveler" cx={travelerX} cy={travelerY} r="8" />
            </svg>
          )}

          <span className="map-compass" aria-hidden="true">
            <Compass
              size={40}
              strokeWidth={1.6}
              animation="default-loop"
              animate={!reducedMotion}
              loop={!reducedMotion}
              loopDelay={3200}
            />
          </span>

          {projectStages.map((item, index) => (
            <button
              className="map-stop"
              type="button"
              data-active={index === active}
              data-done={index < active}
              // Rotulo do lado oposto ao da trilha: paradas do alto (trilha descendo
              // dos dois lados) levam o rotulo em cima, as de baixo levam embaixo.
              data-below={STOPS[index][1] > 0.5}
              style={{ left: `${STOPS[index][0] * 100}%`, top: `${STOPS[index][1] * 100}%` }}
              onClick={() => jumpTo(index)}
              aria-label={`Ir para a etapa ${item.index}: ${item.title}`}
              key={item.id}
            >
              <span className="map-stop-pin">
                <StageIcon stage={item} on={index === active} reducedMotion={reducedMotion} />
              </span>
              <span className="map-stop-label">
                <b>{item.index}</b>
                {item.title}
              </span>
            </button>
          ))}
        </div>

        <div className="map-card" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="map-card-inner"
              key={stage.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: easeOutExpo }}
            >
              <div className="map-card-head">
                <span className="map-card-step">
                  Etapa {stage.index} / {String(projectStages.length).padStart(2, "0")}
                </span>
                <strong>{stage.title}</strong>
                <span className="stage-duration">{stage.duration}</span>
              </div>
              <p className="map-card-summary">{stage.summary}</p>
              <StageFacts stage={stage} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* O mapa e o cartao sao visuais; leitores de tela recebem as etapas
          completas e em ordem aqui. */}
      <ol className="sr-only">
        {projectStages.map((item) => (
          <li key={item.id}>
            <h3>
              {item.index}. {item.title} ({item.duration})
            </h3>
            <p>{item.summary}</p>
            <StageFacts stage={item} />
          </li>
        ))}
      </ol>
    </div>
  );
}

// Versao em coluna para celular e para quem prefere menos movimento: a mesma
// trilha, vertical, preenchida conforme a leitura.
function Trail({ reducedMotion }) {
  const listRef = useRef(null);
  const stopRefs = useRef([]);
  const [active, setActive] = useState(-1);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 65%"] });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-40% 0px -55%", threshold: 0 },
    );

    stopRefs.current.forEach((stop) => stop && observer.observe(stop));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="trail">
      <span className="trail-line" aria-hidden="true">
        <motion.span style={{ scaleY: scrollYProgress }} />
      </span>
      <ol className="trail-list" ref={listRef}>
        {projectStages.map((stage, index) => (
          <li
            className="trail-stop"
            data-index={index}
            data-active={index === active}
            data-done={index < active}
            ref={(node) => {
              stopRefs.current[index] = node;
            }}
            key={stage.id}
          >
            <span className="trail-pin" aria-hidden="true">
              <StageIcon stage={stage} on={index === active} reducedMotion={reducedMotion} size={20} />
            </span>
            <div className="trail-card">
              <span className="map-card-step">Etapa {stage.index}</span>
              <h3>{stage.title}</h3>
              <span className="stage-duration">{stage.duration}</span>
              <p className="map-card-summary">{stage.summary}</p>
              <StageFacts stage={stage} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProjectStages() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 64rem)");

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
            O mapa
            <br />
            do projeto<span>.</span>
          </h2>
        </div>
        <p className="chapter-lede">
          Cinco paradas entre a primeira conversa e o lançamento. Em cada uma você recebe algo
          concreto e decide antes de seguir, sem atalho escondido nem surpresa no caminho.
        </p>
      </motion.header>

      {isDesktop && !reducedMotion ? (
        <TreasureMap reducedMotion={reducedMotion} />
      ) : (
        <Trail reducedMotion={reducedMotion} />
      )}

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
