import { useMemo } from "react";

import { cn } from "@/src/lib/utils";

// Marquee do 3d-testimonials (21st.dev), portado para JSX. Ajustes em relacao ao
// original: classes condicionais sem objeto, porque o `cn` do projeto e um join
// simples; e sem `tabIndex`, porque aqui ele e decorativo e fica dentro de um
// bloco `aria-hidden`, onde um foco de teclado seria uma armadilha.
//
// As animacoes `animate-marquee` e `animate-marquee-vertical` vem do `@theme` em
// src/styles.css. `--duration` e `--gap` podem ser sobrescritos por `style`.
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = "off",
  ariaRole = "marquee",
  ...props
}) {
  const copies = useMemo(
    () =>
      Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      )),
    [repeat, children, vertical, pauseOnHover, reverse],
  );

  return (
    <div
      {...props}
      data-slot="marquee"
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
    >
      {copies}
    </div>
  );
}
