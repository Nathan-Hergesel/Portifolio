"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const WORDS = ["Projetos", "Sites", "Apps", "Vídeos", "Design", "Sistemas"];
const LETTER_DURATION = 560;
const LETTER_STAGGER = 44;
const NEXT_WORD_OFFSET = 90;
const WORD_HOLD = 2600;

function WordLetters({ word }) {
  return [...word].map((letter, index) => (
    <span
      className="rotating-letter"
      key={`${letter}-${index}`}
      style={{ "--letter-index": index }}
    >
      {letter === " " ? "\u00a0" : letter}
    </span>
  ));
}

export function RotatingHeadline() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const currentWordRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [rolling, setRolling] = useState(false);
  const nextIndex = (wordIndex + 1) % WORDS.length;

  const updateCursorPosition = useCallback(() => {
    if (!containerRef.current || !currentWordRef.current) return;
    containerRef.current.style.setProperty(
      "--cursor-x",
      `${currentWordRef.current.getBoundingClientRect().width}px`
    );
  }, []);

  useLayoutEffect(() => {
    let active = true;
    const updateWhenReady = () => {
      if (active) updateCursorPosition();
    };

    updateCursorPosition();
    document.fonts?.ready.then(updateWhenReady);
    window.addEventListener("resize", updateWhenReady);

    return () => {
      active = false;
      window.removeEventListener("resize", updateWhenReady);
    };
  }, [updateCursorPosition, wordIndex]);

  useEffect(() => {
    if (reducedMotion || rolling) return undefined;
    const timeout = window.setTimeout(() => setRolling(true), WORD_HOLD);
    return () => window.clearTimeout(timeout);
  }, [reducedMotion, rolling, wordIndex]);

  useEffect(() => {
    if (!rolling) return undefined;

    const currentWordDuration =
      LETTER_DURATION + (WORDS[wordIndex].length - 1) * LETTER_STAGGER;
    const nextWordDuration =
      NEXT_WORD_OFFSET + LETTER_DURATION + (WORDS[nextIndex].length - 1) * LETTER_STAGGER;
    const transitionDuration = Math.max(currentWordDuration, nextWordDuration) + 40;

    const timeout = window.setTimeout(() => {
      setWordIndex(nextIndex);
      setRolling(false);
    }, transitionDuration);

    return () => window.clearTimeout(timeout);
  }, [nextIndex, rolling, wordIndex]);

  return (
    <span
      className={`rotating-word${rolling ? " is-rolling" : ""}`}
      data-rotating-word
      ref={containerRef}
      style={{
        "--letter-duration": `${LETTER_DURATION}ms`,
        "--letter-stagger": `${LETTER_STAGGER}ms`,
        "--next-word-offset": `${NEXT_WORD_OFFSET}ms`
      }}
    >
      <span className="sr-only" data-rotating-accessible>
        {WORDS[wordIndex]}
      </span>
      <span className="rotating-word-current" aria-hidden="true" ref={currentWordRef}>
        {reducedMotion ? WORDS[wordIndex] : <WordLetters word={WORDS[wordIndex]} />}
      </span>
      <span className="rotating-word-next" aria-hidden="true">
        {!reducedMotion && <WordLetters word={WORDS[nextIndex]} />}
      </span>
      <span className="blue-dot" aria-hidden="true" key={`cursor-${wordIndex}`} />
    </span>
  );
}
