"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent, motion, MotionValue } from "framer-motion";

type StackItem = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const cardThemes = [
  {
    icon: "from-blue-600 to-blue-500",
    shadow: "shadow-blue-600/25",
    ring: "ring-blue-100 dark:ring-blue-900/50",
    dot: "bg-blue-600",
    blob: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: "from-emerald-600 to-emerald-500",
    shadow: "shadow-emerald-600/25",
    ring: "ring-emerald-100 dark:ring-emerald-900/50",
    dot: "bg-emerald-600",
    blob: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: "from-violet-600 to-violet-500",
    shadow: "shadow-violet-600/25",
    ring: "ring-violet-100 dark:ring-violet-900/50",
    dot: "bg-violet-600",
    blob: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: "from-amber-500 to-amber-400",
    shadow: "shadow-amber-500/25",
    ring: "ring-amber-100 dark:ring-amber-900/50",
    dot: "bg-amber-500",
    blob: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: "from-rose-600 to-rose-500",
    shadow: "shadow-rose-600/25",
    ring: "ring-rose-100 dark:ring-rose-900/50",
    dot: "bg-rose-600",
    blob: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: "from-cyan-600 to-cyan-500",
    shadow: "shadow-cyan-600/25",
    ring: "ring-cyan-100 dark:ring-cyan-900/50",
    dot: "bg-cyan-600",
    blob: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
  },
];

function StackCard({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: StackItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / total;
  const enter = index * segmentSize;
  const active = index * segmentSize + segmentSize / 2;
  const exit = (index + 1) * segmentSize;

  const scale = useTransform(scrollYProgress, [enter, active, exit], [0.65, 1, 0.8]);
  const y = useTransform(scrollYProgress, [enter, active, exit], [140, 0, -110]);
  const opacity = useTransform(scrollYProgress, [enter, active, exit], [0, 1, 0.2]);

  const theme = cardThemes[index % cardThemes.length];
  const step = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      style={{ scale, y, opacity }}
      className="absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-16"
    >
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-200/60 dark:ring-gray-800/60">
        {/* Decorative blobs */}
        <div
          className={`absolute -top-48 -right-48 size-[30rem] rounded-full bg-gradient-to-br ${theme.icon} opacity-[0.04] dark:opacity-[0.08] blur-3xl`}
        />
        <div
          className={`absolute -bottom-48 -left-48 size-[24rem] rounded-full bg-gradient-to-br ${theme.icon} opacity-[0.03] dark:opacity-[0.06] blur-3xl`}
        />

        {/* Step number */}
        <div
          className={`absolute top-6 right-8 text-7xl font-black ${theme.text} opacity-[0.04] dark:opacity-[0.06] select-none`}
        >
          {step}
        </div>

        <div className="relative flex flex-col lg:flex-row items-center gap-10 p-8 md:p-12 lg:p-16">
          {/* Icon panel */}
          <div
            className={`flex size-36 md:size-44 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br ${theme.icon} shadow-2xl ${theme.shadow} ring-1 ring-white/20`}
          >
            <item.icon className="size-16 md:size-20 text-white" />
          </div>

          {/* Content */}
          <div>
            <span
              className={`text-sm font-semibold tracking-widest uppercase ${theme.text}`}
            >
              Característica 0{index + 1}
            </span>
            <h3 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <p className="mt-5 text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: MotionValue<number>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(current, "change", (v: number) => {
    const idx = Math.min(Math.floor(v * total), total - 1);
    setActiveIndex(idx);
  });

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-700 ${
            i === activeIndex
              ? `${cardThemes[i % cardThemes.length].dot} size-3.5`
              : "bg-gray-300 dark:bg-gray-600 size-2.5"
          }`}
        />
      ))}
    </div>
  );
}

export function ScrollStack({ items }: { items: StackItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {items.map((item, i) => (
            <StackCard
              key={i}
              item={item}
              index={i}
              total={items.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
        <ProgressDots total={items.length} current={scrollYProgress} />
      </div>
    </div>
  );
}
