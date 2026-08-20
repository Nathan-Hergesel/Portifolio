"use client";

import { useEffect, useRef, useState } from "react";
import { Header, MenuToggle } from "./Header";
import { usePageNavigation } from "../hooks/usePageNavigation";
import { useReveal } from "../hooks/useReveal";

export function PortfolioChrome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const progressRef = useRef(null);
  const activeSection = usePageNavigation(progressRef, headerRef);

  useReveal();

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape" || !menuOpen) return;
      setMenuOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <MenuToggle
        buttonRef={menuButtonRef}
        menuOpen={menuOpen}
        onToggle={() => setMenuOpen((open) => !open)}
      />
      <Header
        activeSection={activeSection}
        headerRef={headerRef}
        menuOpen={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />
    </>
  );
}
