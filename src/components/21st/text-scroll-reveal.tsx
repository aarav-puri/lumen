"use client";

// 21st.dev: abushaidislam7/text-scroll-reveal (blur-reveal and change-color presets)
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

function Word({
  word, i, total, progress, preset, base, muted, accent,
}: {
  word: string; i: number; total: number; progress: MotionValue<number>;
  preset: "blur-reveal" | "change-color" | "fade"; base: string; muted: string; accent: string;
}) {
  const start = (i / Math.max(1, total)) * 0.78;
  const end = Math.min(1, start + Math.max(0.14, 1.8 / total));
  const opacity = useTransform(progress, [start, end], [preset === "change-color" ? 1 : preset === "fade" ? 0.16 : 0, 1]);
  const filter = useTransform(progress, [start, end], [preset === "blur-reveal" ? "blur(10px)" : "blur(0px)", "blur(0px)"]);
  const color = useTransform(progress, [start, end], preset === "change-color" ? [muted, accent] : [base, base]);
  return (
    <span className="mr-[0.26em] inline-block">
      <motion.span style={preset === "fade" ? { opacity } : { opacity, filter, color }} className="inline-block">
        {word}
      </motion.span>
    </span>
  );
}

export function TextScrollReveal({
  text,
  preset = "blur-reveal",
  base = "#f5f5f7",
  muted = "#3a3a3c",
  accent = "#f5f5f7",
  className = "",
}: {
  text: string;
  preset?: "blur-reveal" | "change-color" | "fade";
  base?: string;
  muted?: string;
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.42"] });
  const p = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.22 });
  const words = text.split(/\s+/);
  return (
    <div ref={ref} className={className}>
      <p aria-label={text}>
        {reduce
          ? text
          : words.map((w, i) => (
              <Word key={i} word={w} i={i} total={words.length} progress={p} preset={preset} base={base} muted={muted} accent={accent} />
            ))}
      </p>
    </div>
  );
}
