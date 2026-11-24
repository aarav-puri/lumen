"use client";

// 21st.dev: danielpetho/basic-number-ticker (starts when scrolled into view)
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";

export function NumberTicker({
  target, from = 0, decimals = 0, duration = 2.2, className,
}: { target: number; from?: number; decimals?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(from);
  const text = useTransform(count, (v) =>
    v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  );
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(target);
      return;
    }
    const c = animate(count, target, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView, reduce, target, duration, count]);
  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
