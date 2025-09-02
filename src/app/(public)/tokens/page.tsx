import DarkToggle from "@/app/(public)/tokens/DarkToggle";

function ColorSwatch({ name, bg, fg }: { name: string; bg: string; fg: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-md border"
        style={{ backgroundColor: `var(--${bg})`, color: `var(--${fg})`, borderColor: "var(--color-border)" }}
      />
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="text-[10px] text-muted-foreground">bg: --{bg} / fg: --{fg}</div>
    </div>
  );
}

function BorderSwatch({ name, colorVar }: { name: string; colorVar: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 w-full rounded-md bg-background" style={{ border: `2px solid var(--${colorVar})` }} />
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="text-[10px] text-muted-foreground">--{colorVar}</div>
    </div>
  );
}

function RadiusSwatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 w-full border bg-card" style={{ borderRadius: `var(--${varName})`, borderColor: "var(--color-border)" }} />
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="text-[10px] text-muted-foreground">--{varName}</div>
    </div>
  );
}

function ShadowSwatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 w-full rounded-md border bg-card" style={{ boxShadow: `var(--${varName})`, borderColor: "var(--color-border)" }} />
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="text-[10px] text-muted-foreground">--{varName}</div>
    </div>
  );
}

function TypeRow({ label, sizeVar, lhVar }: { label: string; sizeVar: string; lhVar: string }) {
  return (
    <div className="flex items-baseline justify-between border-b py-3" style={{ borderColor: "var(--color-border)" }}>
      <div className="text-muted-foreground">{label}</div>
      <div className="grow px-4">
        <div style={{ fontSize: `var(--${sizeVar})`, lineHeight: `var(--${lhVar})`, fontFamily: "var(--font-outfit)" }}>
          The quick brown fox jumps over the lazy dog — حروف فارسی نمونه
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground">--{sizeVar} / --{lhVar}</div>
    </div>
  );
}

export default function TokensPage() {
  const colorPairs = [
    { name: "Background / Foreground", bg: "color-background", fg: "color-foreground" },
    { name: "Muted", bg: "color-muted", fg: "color-muted-foreground" },
    { name: "Card", bg: "color-card", fg: "color-card-foreground" },
    { name: "Popover", bg: "color-popover", fg: "color-popover-foreground" },
    { name: "Primary", bg: "color-primary", fg: "color-primary-foreground" },
    { name: "Secondary", bg: "color-secondary", fg: "color-secondary-foreground" },
    { name: "Accent", bg: "color-accent", fg: "color-accent-foreground" },
    { name: "Brand", bg: "color-brand", fg: "color-brand-foreground" },
    { name: "Info", bg: "color-info", fg: "color-info-foreground" },
  ];

  const radii = [
    { name: "radius-sm", varName: "radius-sm" },
    { name: "radius", varName: "radius" },
    { name: "radius-lg", varName: "radius-lg" },
    { name: "radius-2xl", varName: "radius-2xl" },
  ];

  const shadows = [
    { name: "shadow-sm", varName: "shadow-sm" },
    { name: "shadow", varName: "shadow" },
    { name: "shadow-xl", varName: "shadow-xl" },
    { name: "shadow-theme-sm", varName: "shadow-theme-sm" },
    { name: "shadow-theme-lg", varName: "shadow-theme-lg" },
    { name: "shadow-theme-xl", varName: "shadow-theme-xl" },
  ];

  const typeRows = [
    { label: "Title 2XL", sizeVar: "text-title-2xl", lhVar: "text-title-2xl--line-height" },
    { label: "Title XL", sizeVar: "text-title-xl", lhVar: "text-title-xl--line-height" },
    { label: "Title LG", sizeVar: "text-title-lg", lhVar: "text-title-lg--line-height" },
    { label: "Title MD", sizeVar: "text-title-md", lhVar: "text-title-md--line-height" },
    { label: "Title SM", sizeVar: "text-title-sm", lhVar: "text-title-sm--line-height" },
    { label: "Text XL", sizeVar: "text-theme-xl", lhVar: "text-theme-xl--line-height" },
    { label: "Text SM", sizeVar: "text-theme-sm", lhVar: "text-theme-sm--line-height" },
    { label: "Text XS", sizeVar: "text-theme-xs", lhVar: "text-theme-xs--line-height" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Theme Tokens</h1>
        <DarkToggle />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Colors</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {colorPairs.map((c) => (
            <ColorSwatch key={c.name} name={c.name} bg={c.bg} fg={c.fg} />
          ))}
          <BorderSwatch name="Border" colorVar="color-border" />
          <BorderSwatch name="Ring" colorVar="color-ring" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Radius</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {radii.map((r) => (
            <RadiusSwatch key={r.varName} name={r.name} varName={r.varName} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Shadows</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {shadows.map((s) => (
            <ShadowSwatch key={s.varName} name={s.name} varName={s.varName} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Typography</h2>
        <div className="divide-y rounded-md border bg-card" style={{ borderColor: "var(--color-border)" }}>
          {typeRows.map((t) => (
            <TypeRow key={t.sizeVar} label={t.label} sizeVar={t.sizeVar} lhVar={t.lhVar} />
          ))}
        </div>
      </section>
    </div>
  );
}


