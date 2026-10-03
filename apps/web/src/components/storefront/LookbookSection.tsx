'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Quote, Sparkles, Star, CheckCircle2 } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { getThemeCopy } from '@/lib/theme-copy';
import { getApiUrl } from '@/lib/api-client';

interface ReviewItem {
  id: string;
  order_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  photo_url?: string | null;
  product_name?: string | null;
  created_at: string;
}

export const LookbookSection: React.FC = () => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [dbReviews, setDbReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    setMounted(true);

    fetch(getApiUrl('/api/v1/reviews/approved'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDbReviews(res.data);
        }
      })
      .catch(() => {});
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

        {/* REVIEWS GRID: SHOW LIVE DATABASE REVIEWS IF AVAILABLE, OTHERWISE THEME STORIES */}
        {dbReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dbReviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="card-atelier overflow-hidden flex flex-col justify-between card-tilt-hover bg-white border border-theme-border rounded-2xl shadow-xs"
              >
                {/* PHOTO IF AVAILABLE */}
                {rev.photo_url && (
                  <div className="h-44 w-full overflow-hidden bg-stone-100 relative">
                    <img
                      src={rev.photo_url}
                      alt={`Foto Ulasan ${rev.customer_name}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Foto Buket Pembeli</span>
                    </div>
                  </div>
                )}

                {/* USER BADGE & RATING */}
                <div className="p-5 pb-3 flex items-center justify-between border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 font-extrabold text-sm flex items-center justify-center">
                      {rev.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-black text-stone-900 flex items-center gap-1">
                        <span>{rev.customer_name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                      </div>
                      <div className="text-[10px] text-stone-400 font-medium">
                        {rev.product_name || 'Buket Kawat Bulu Chenille'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* COMMENT */}
                <div className="p-5 pt-3 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-theme-text-main leading-relaxed italic relative pl-3.5 border-l-2 border-theme-primary font-medium">
                    "{rev.comment}"
                  </p>

                  <div className="pt-3 border-t border-theme-border/60 flex items-center justify-between text-xs text-theme-text-muted font-medium">
                    <span className="flex items-center gap-1 text-[11px] text-theme-primary font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>Pembeli Terverifikasi</span>
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(rev.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};
