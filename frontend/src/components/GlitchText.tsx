import { useState, useEffect, useRef } from 'react';
import styles from './GlitchText.module.css';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  className?: string;
  /** How often the glitch fires (ms between glitch bursts). Default 4000 */
  interval?: number;
  /** Colour variant. Default 'cyan' */
  variant?: 'cyan' | 'magenta' | 'gold';
}

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function randomGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function GlitchText({
  text,
  as: Tag = 'span',
  className,
  interval = 4000,
  variant = 'cyan',
}: GlitchTextProps) {
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => {
    const fire = () => {
      let iteration = 0;
      if (iterRef.current) clearInterval(iterRef.current);
      iterRef.current = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((char, idx) => {
              if (char === ' ') return ' ';
              if (idx < iteration) return text[idx];
              return randomGlitchChar();
            })
            .join(''),
        );
        iteration += 1 / 3;
        if (iteration >= text.length) {
          clearInterval(iterRef.current!);
          setDisplay(text);
        }
      }, 30);
    };

    timerRef.current = setTimeout(function repeat() {
      fire();
      timerRef.current = setTimeout(repeat, interval);
    }, interval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (iterRef.current) clearInterval(iterRef.current);
    };
  }, [text, interval]);

  return (
    <Tag
      className={`${styles.glitch} ${styles[variant]} ${className ?? ''}`}
      data-text={text}
    >
      {display}
    </Tag>
  );
}
