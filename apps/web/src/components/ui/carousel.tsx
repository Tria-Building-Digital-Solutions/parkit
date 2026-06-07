"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface PricingSlide {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  features: string[];
  featured: boolean;
}

interface CarouselProps {
  slides: PricingSlide[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  annual: boolean;
  saveLabel?: string;
  selectLabel?: string;
  selectedLabel?: string;
}

export default function PricingCarousel({
  slides,
  selectedIndex,
  onSelect,
  annual,
  saveLabel = "Save 20%",
  selectLabel = "Select",
  selectedLabel = "Selected",
}: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full">
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => {
              const isSelected = selectedIndex === i;
              return (
                <div key={i} className="min-w-0 w-full shrink-0 px-0.5">
                  <div
                    className={`relative rounded-2xl border backdrop-blur-2xl transition-all duration-300 ${
                      slide.featured
                        ? "border-company-primary/30 bg-white/60 dark:bg-slate-900/60"
                        : "border-card-border/80 bg-white/60 dark:bg-slate-900/60"
                    }`}
                  >
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {slide.name}
                      </h3>
                      <p className="mt-3 flex items-baseline gap-2">
                        <span className={`text-2xl font-bold tracking-tight ${slide.featured ? "text-company-primary" : "text-text-primary"}`}>
                          {annual ? slide.annualPrice : slide.monthlyPrice}
                        </span>
                        <span className="text-[11px] font-medium text-text-muted">
                          /{annual ? "year" : "mo"}
                        </span>
                        {annual && (
                          <span className="inline-flex rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 text-[9px] font-bold leading-tight">
                            {saveLabel}
                          </span>
                        )}
                      </p>
                      <button
                        onClick={() => onSelect(i)}
                        className={`mt-4 w-full rounded-full py-2.5 text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-company-primary/5 text-company-primary border border-company-primary/30"
                            : "bg-company-primary text-white shadow-sm hover:brightness-110"
                        }`}
                      >
                        {isSelected ? selectedLabel : selectLabel}
                      </button>
                    </div>
                    <div className="border-t border-border-color/50 px-5 py-4">
                      <ul className="space-y-2">
                        {slide.features.map((feature) => (
                          <li key={feature} className="flex gap-2 text-xs text-text-secondary">
                            <Check className="w-3.5 h-3.5 shrink-0 text-company-primary mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full border border-card-border/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl text-text-secondary hover:text-text-primary hover:border-company-primary/30 transition-all duration-200"
          onClick={prev}
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-5 bg-company-primary" : "w-1.5 bg-neutral-300 dark:bg-neutral-600"
              }`}
            />
          ))}
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full border border-card-border/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl text-text-secondary hover:text-text-primary hover:border-company-primary/30 transition-all duration-200"
          onClick={next}
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
