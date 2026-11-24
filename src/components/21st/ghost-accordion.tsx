"use client";

// 21st.dev: arihantcodes/accordion-ghost (numbered, plus indicator, radix primitives)
import * as A from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function GhostAccordion({
  items,
  className,
  numberClass = "text-neutral-400",
  bodyClass = "text-neutral-500",
  lineClass = "border-neutral-200",
}: {
  items: { q: string; a: string }[];
  className?: string;
  numberClass?: string;
  bodyClass?: string;
  lineClass?: string;
}) {
  return (
    <A.Root type="single" collapsible className={cn("w-full", className)}>
      {items.map((it, i) => (
        <A.Item key={it.q} value={it.q} className={cn("border-b", lineClass)}>
          <A.Header className="flex">
            <A.Trigger className="group flex flex-1 items-center justify-between gap-4 py-5 text-left text-[15px] font-medium outline-none focus-visible:underline">
              <span className="flex items-center gap-4">
                <span className={cn("w-5 text-xs tabular-nums", numberClass)}>{String(i + 1).padStart(2, "0")}</span>
                {it.q}
              </span>
              <Plus className="size-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45" />
            </A.Trigger>
          </A.Header>
          <A.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className={cn("pb-5 pl-9 pr-8 text-sm leading-relaxed", bodyClass)}>{it.a}</p>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
