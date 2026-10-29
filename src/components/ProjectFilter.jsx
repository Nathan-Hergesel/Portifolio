"use client";

import { Brush } from "./animate-ui/icons/brush";
import { Clapperboard } from "./animate-ui/icons/clapperboard";
import { Layers } from "./animate-ui/icons/layers";
import { MessageSquareCode } from "./animate-ui/icons/message-square-code";
import { Sparkles } from "./animate-ui/icons/sparkles";
import { Terminal } from "./animate-ui/icons/terminal";
import { useReducedMotion } from "../hooks/useReducedMotion";

// Mesmo vocabulario de icones da nuvem de ferramentas do hero, para que a leitura
// de "o que ele faz" seja a mesma nas duas secoes.
// `delay` e `loopDelay` sao propositalmente irregulares: com valores iguais os
// seis icones piscariam em uniso, o que chama mais atencao que o conteudo.
export const CATEGORIES = [
  {
    id: "destaque",
    label: "Em destaque",
    Icon: Sparkles,
    delay: 0,
    loopDelay: 2600,
  },
  {
    id: "Site",
    label: "Sites",
    Icon: MessageSquareCode,
    delay: 140,
    loopDelay: 2100,
  },
  {
    id: "App",
    label: "Apps",
    Icon: Layers,
    animation: "default-loop",
    delay: 420,
    loopDelay: 1700,
  },
  {
    id: "Sistema",
    label: "Sistemas",
    Icon: Terminal,
    delay: 700,
    loopDelay: 2400,
  },
  { id: "Design", label: "Designs", Icon: Brush, delay: 980, loopDelay: 1900 },
  {
    id: "Vídeo",
    label: "Vídeos",
    Icon: Clapperboard,
    delay: 1260,
    loopDelay: 2250,
  },
];

export function ProjectFilter({ active, onChange, counts }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="bento-filter"
      role="group"
      aria-label="Filtrar projetos por tipo"
    >
      {CATEGORIES.map(({ id, label, Icon, animation, delay, loopDelay }) => {
        const selected = active === id;
        const count = id === "destaque" ? counts.total : (counts[id] ?? 0);

        return (
          <button
            className="bento-filter-chip"
            type="button"
            key={id}
            aria-pressed={selected}
            onClick={() => onChange(id)}
          >
            {Icon && (
              <Icon
                className="bento-filter-icon"
                size={20}
                strokeWidth={2.2}
                animate={!reducedMotion}
                animation={animation}
                loop={!reducedMotion}
                delay={delay}
                loopDelay={loopDelay}
                aria-hidden="true"
              />
            )}
            <span className="bento-filter-label">{label}</span>
            <span className="bento-filter-count">
              {String(count).padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
