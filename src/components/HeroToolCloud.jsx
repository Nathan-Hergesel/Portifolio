"use client";

import { Brush } from "./animate-ui/icons/brush";
import { Clapperboard } from "./animate-ui/icons/clapperboard";
import { Layers } from "./animate-ui/icons/layers";
import { MessageSquareCode } from "./animate-ui/icons/message-square-code";
import { Terminal } from "./animate-ui/icons/terminal";
import { useReducedMotion } from "../hooks/useReducedMotion";

const tools = [
  {
    Icon: Clapperboard,
    className: "hero-tool-video",
    delay: 120,
    loopDelay: 1700
  },
  {
    Icon: MessageSquareCode,
    className: "hero-tool-code",
    delay: 480,
    loopDelay: 2100
  },
  {
    Icon: Terminal,
    className: "hero-tool-terminal",
    delay: 760,
    loopDelay: 1500
  },
  {
    Icon: Layers,
    className: "hero-tool-layers",
    animation: "default-loop",
    delay: 1040,
    loopDelay: 1900
  },
  {
    Icon: Brush,
    className: "hero-tool-design",
    delay: 1320,
    loopDelay: 2300
  }
];

export function HeroToolCloud() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="hero-tool-cloud" aria-hidden="true">
      {tools.map(({ Icon, className, animation, delay, loopDelay }) => (
        <Icon
          className={`hero-tool ${className}`}
          strokeWidth={2.35}
          animate={!reducedMotion}
          animation={animation}
          loop={!reducedMotion}
          delay={delay}
          loopDelay={loopDelay}
          key={className}
        />
      ))}
    </div>
  );
}
