"use client";

// 21st.dev: felipemenezes098/scroll-01 (sticky media that swaps as copy scrolls; media is a ReactNode here)
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type Item = { title: string; description: string; media: ReactNode };

function ScrollItem({ item, index, setActive }: { item: Item; index: number; setActive: Dispatch<SetStateAction<number>> }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 15%"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], index === 0 ? [1, 0.7, 1, 0] : [0, 0.7, 1, 0]);
  const active = useTransform(scrollYProgress, (v) => v > 0.35 && v < 0.65);
  useMotionValueEvent(active, "change", (v) => v && setActive(index));
  return (
    <motion.article ref={ref} style={{ opacity, y }}>
      <h3 className="text-3xl font-semibold tracking-[-0.03em]">{item.title}</h3>
      <p className="mt-3 max-w-sm text-lg leading-relaxed text-ink-2">{item.description}</p>
    </motion.article>
  );
}

export function StickyMediaScroll({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className="space-y-16 md:hidden">
        {items.map((it) => (
          <article key={it.title} className="space-y-6">
            <div>
              <h3 className="text-3xl font-semibold tracking-[-0.03em]">{it.title}</h3>
              <p className="mt-3 text-lg text-ink-2">{it.description}</p>
            </div>
            <div className="flex justify-center">{it.media}</div>
          </article>
        ))}
      </div>
      <div className="hidden gap-16 md:grid md:grid-cols-2">
        <div className="py-[30vh]">
          <div className="space-y-[40vh]">
            {items.map((it, i) => (
              <ScrollItem key={it.title} item={it} index={i} setActive={setActive} />
            ))}
          </div>
        </div>
        <div className="sticky top-[12vh] grid h-[76vh] place-items-center">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              className="col-start-1 row-start-1"
              initial={false}
              animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {it.media}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
