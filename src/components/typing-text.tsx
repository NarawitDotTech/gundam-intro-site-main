"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type TypingTextProps = {
  words: string[];
  className?: string;
};

/** Cycles through words with a typewriter effect; static under reduced motion. */
export function TypingText({ words, className = "" }: TypingTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const isStatic = useReducedMotion();

  useEffect(() => {
    if (isStatic) return;

    const currentWord = words[wordIndex];
    let delay = isDeleting ? 70 : 120;

    if (!isDeleting && typedWord === currentWord) {
      delay = 1400;
    }

    if (isDeleting && typedWord.length === 0) {
      delay = 350;
    }

    const timeoutId = window.setTimeout(() => {
      if (!isDeleting) {
        if (typedWord === currentWord) {
          setIsDeleting(true);
          return;
        }

        setTypedWord(currentWord.slice(0, typedWord.length + 1));
        return;
      }

      if (typedWord.length === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }

      setTypedWord(currentWord.slice(0, typedWord.length - 1));
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isDeleting, isStatic, typedWord, wordIndex, words]);

  return (
    <span className={className}>
      <span>{isStatic ? words[0] : typedWord}</span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[0.95em] w-[0.09em] translate-y-[0.12em] animate-cursor bg-accent-300"
      />
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
