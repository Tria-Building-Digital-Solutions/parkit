"use client";

import { motion } from "framer-motion";

export function PhoneSkeleton() {
  const bars = [
    { delay: 0.1, width: "w-3/4", color: "bg-blue-500/40" },
    { delay: 0.3, width: "w-1/2", color: "bg-blue-500/30" },
    { delay: 0.5, width: "w-2/3", color: "bg-emerald-500/40" },
    { delay: 0.7, width: "w-3/5", color: "bg-blue-500/30" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-44 w-24 rounded-[18px] border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 p-2 shadow-lg">
        <div className="flex h-full w-full flex-col justify-end gap-2 rounded-xl bg-gradient-to-b from-blue-500/10 to-blue-600/5 p-3">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: bar.delay, ease: "easeOut" }}
              className={`h-2 rounded-full ${bar.color} ${bar.width}`}
            />
          ))}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 1 }}
            className="mx-auto mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/30"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-2 w-2 rounded-full bg-emerald-500"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <div className="grid h-full w-full grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="rounded-xl bg-neutral-100 dark:bg-neutral-900 p-2 flex flex-col justify-between"
          >
            <div className="h-1.5 w-1/2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <div className="flex items-end gap-1">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: ["60%", "90%", "60%"] }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: i * 0.15 + 0.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 rounded-t-sm bg-gradient-to-t from-blue-500/60 to-blue-400/30"
                style={{ height: `${50 + i * 10}%` }}
              />
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${40 + i * 12}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.6 }}
                className="w-2 rounded-t-sm bg-blue-500/30"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  const bars = [70, 45, 90, 60, 80, 55, 95];

  return (
    <div className="flex h-full w-full items-end justify-center gap-2 p-4">
      <div className="flex h-full items-end gap-2">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: `${h}%`, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            className="w-5 rounded-t-lg bg-gradient-to-t from-blue-600/40 to-blue-400/20 dark:from-blue-500/30 dark:to-blue-400/10"
          />
        ))}
      </div>
    </div>
  );
}
