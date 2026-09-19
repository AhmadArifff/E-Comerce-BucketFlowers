'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Quote, Sparkles } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { getThemeCopy } from '@/lib/theme-copy';

export const LookbookSection: React.FC = () => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : 'tema-a';
  const copy = getThemeCopy(activeTheme);

  return (
    <section id="lookbook" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-theme-border">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-surface-subtle border border-theme-border text-theme-primary text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-theme-primary text-theme-primary" />
            <span>Alumni & Customer Moments</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-theme-text-main tracking-tight font-heading">
            {copy.lookbook.sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
            {copy.lookbook.sectionSubtitle}
          </p>
        </div>

        {/* 3 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.lookbook.stories.map((story, idx) => (
            <div
              key={idx}
              className="card-atelier overflow-hidden flex flex-col justify-between card-tilt-hover bg-white border border-theme-border rounded-2xl shadow-xs"
            >
              {/* TOP ACCENT */}
              <div className={`p-6 ${story.avatarBg} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white/90 shadow-2xs flex items-center justify-center font-bold text-sm">
                    {story.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold">{story.author}</div>
                    <div className="text-[10px] opacity-85">{story.occasion}</div>
                  </div>
                </div>
                <Quote className="w-5 h-5 opacity-40" />
              </div>

              {/* CARD DETAILS */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-theme-text-main leading-relaxed italic relative pl-3.5 border-l-2 border-theme-primary font-medium">
                  "{story.quote}"
                </p>

                <div className="pt-3 border-t border-theme-border/60 flex items-center justify-between text-xs text-theme-text-muted font-medium">
                  <span className="flex items-center gap-1 text-[11px] text-theme-primary font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>Verified Atelier Story</span>
                  </span>
                  <span className="text-[11px]">100% Chenille Craft</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
