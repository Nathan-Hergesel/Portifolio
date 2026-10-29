import { useEffect } from "react";

// Distancia minima de rolagem para trocar de direcao, para tremidas de trackpad
// nao ficarem mostrando e escondendo o cabecalho.
const SCROLL_TOLERANCE = 8;
// Faixa no topo da janela que traz o cabecalho de volta quando o mouse chega.
const REVEAL_ZONE = 32;

export function useHeaderAutoHide(headerRef) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    // So no desktop: no celular o menu em tela cheia vive dentro do cabecalho com
    // `position: fixed`, e um transform no cabecalho quebraria esse overlay.
    const desktop = window.matchMedia("(min-width: 64rem)");
    let lastY = window.scrollY;
    let hiddenByScroll = false;
    let pointerNear = false;
    let animationFrame = 0;

    const render = () => {
      const focusInside = header.contains(document.activeElement);
      const hide = desktop.matches && hiddenByScroll && !pointerNear && !focusInside;
      header.classList.toggle("is-hidden", hide);
    };

    const updateFromScroll = () => {
      animationFrame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < SCROLL_TOLERANCE) return;

      // Perto do topo ele sempre aparece; dali para baixo segue a direcao.
      hiddenByScroll = y > header.offsetHeight * 2 && delta > 0;
      lastY = y;
      render();
    };

    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateFromScroll);
    };

    const handlePointerMove = (event) => {
      // Escondido, so a faixa fina do topo revela; visivel, ele fica enquanto o
      // mouse estiver sobre ele.
      const limit = header.classList.contains("is-hidden") ? REVEAL_ZONE : header.offsetHeight;
      const near = event.clientY <= limit;
      if (near === pointerNear) return;
      pointerNear = near;
      render();
    };

    const handlePointerLeave = () => {
      if (!pointerNear) return;
      pointerNear = false;
      render();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    header.addEventListener("focusin", render);
    header.addEventListener("focusout", render);
    desktop.addEventListener("change", render);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      header.removeEventListener("focusin", render);
      header.removeEventListener("focusout", render);
      desktop.removeEventListener("change", render);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [headerRef]);
}
