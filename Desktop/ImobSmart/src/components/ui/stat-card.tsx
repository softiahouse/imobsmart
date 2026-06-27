interface StatCardProps {
  label: string;
  value: number;
  subtitle: string;
  color: string;
}

export function StatCard({ label, value, subtitle, color }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 backdrop-blur-xl"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}40`,
      }}
    >
      <p className="text-xs uppercase tracking-wider" style={{ color: `${color}99` }}>
        {label}
      </p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs mt-1" style={{ color }}>
        {subtitle}
      </p>
    </div>
  );
}
