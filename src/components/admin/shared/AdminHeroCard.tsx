"use client";
import Image from "next/image";

export default function AdminHeroCard() {
  return (
    <div className="glass relative overflow-hidden p-6 md:p-8">

      <div className="grid md:grid-cols-[1.1fr_.9fr] gap-6 items-center relative z-10">
        <div className="space-y-4">
          <p className="text-sm text-white/70">Popular Solution</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Optimize <span className="text-[color:var(--color-primary)]">Your Metrics</span>
          </h2>
          <button className="chip bg-muted hover:bg-muted/80 transition">
            Start Now
          </button>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="glass p-3 text-center">
              <div className="opacity-70">Users</div><div className="text-lg font-semibold">76k</div>
            </div>
            <div className="glass p-3 text-center">
              <div className="opacity-70">Clicks</div><div className="text-lg font-semibold">1.5m</div>
            </div>
            <div className="glass p-3 text-center">
              <div className="opacity-70">Sales</div><div className="text-lg font-semibold">$3.6k</div>
            </div>
          </div>
        </div>

        {/* تصویر سمت راست */}
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden">
          <Image
            src="/images/hero.jpg" /* جایگزین کن */
            alt="hero"
            fill
            className="object-cover"
            priority
          />
          {/* Matte footer strip */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-black/10" />
        </div>
      </div>
    </div>
  );
}
