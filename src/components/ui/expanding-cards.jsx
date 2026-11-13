"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";

// Cards que se expandem: um fica aberto e os outros viram colunas finas (no
// desktop) ou faixas baixas (no celular). Passar o mouse, focar pelo teclado ou
// tocar abre o card. O componente cuida so do layout e do estado ativo; o
// conteudo de cada card vem de `renderCard(item, { active, index })`.
//
// A troca anima porque as trilhas sao sempre `fr` (5fr para o aberto, 1fr para
// os demais): listas com o mesmo numero de trilhas do mesmo tipo interpolam.
export const ExpandingCards = forwardRef(function ExpandingCards(
  { items, defaultActiveIndex = 0, renderCard, className, ...props },
  ref,
) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  // O hover so abre o card depois de uma pausa curta: passar o mouse por cima de
  // varios cards a caminho de outro lugar nao dispara uma troca por card.
  const hoverTimer = useRef(0);
  const cancelHover = () => window.clearTimeout(hoverTimer.current);
  const hoverOpen = (index) => {
    cancelHover();
    hoverTimer.current = window.setTimeout(() => setActiveIndex(index), 90);
  };
  useEffect(() => cancelHover, []);

  const style = useMemo(() => {
    const tracks = items
      .map((_, index) => (index === activeIndex ? "5fr" : "1fr"))
      .join(" ");
    // --count deixa o CSS calcular o tamanho do card aberto (5 partes de
    // count + 4) para fixar a medida do conteudo durante a animacao.
    const base = { "--count": items.length };
    return isDesktop
      ? { ...base, gridTemplateColumns: tracks, gridTemplateRows: "1fr" }
      : { ...base, gridTemplateRows: tracks, gridTemplateColumns: "1fr" };
  }, [activeIndex, items, isDesktop]);

  return (
    <ul
      ref={ref}
      className={cn("expanding-cards", className)}
      style={style}
      {...props}
    >
      {items.map((item, index) => {
        const active = index === activeIndex;
        return (
          <li
            key={item.id}
            className="expanding-card"
            data-active={active}
            tabIndex={0}
            onMouseEnter={() => hoverOpen(index)}
            onMouseLeave={cancelHover}
            onFocus={() => setActiveIndex(index)}
            onClick={() => {
              cancelHover();
              setActiveIndex(index);
            }}
          >
            {renderCard(item, { active, index })}
          </li>
        );
      })}
    </ul>
  );
});
