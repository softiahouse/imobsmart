"use client";

interface PillSelectProps<T extends string> {
  label: string;
  options: readonly { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  activeColor?: string;
}

export function PillSelect<T extends string>({ label, options, value, onChange, activeColor = "rgba(90,90,255,0.3)" }: PillSelectProps<T>) {
  return (
    <div className="glass p-4">
      <p className="text-zinc-500 text-xs mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
              value === opt.key
                ? "text-white"
                : "bg-white/5 border-white/10 text-zinc-500 hover:text-white"
            }`}
            style={value === opt.key ? { background: activeColor, borderColor: "var(--color-accent)" } : undefined}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
