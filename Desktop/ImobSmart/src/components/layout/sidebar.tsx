"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Inicio" },
  { href: "/properties", icon: "🏢", label: "Inmuebles" },
  { href: "/crm", icon: "📋", label: "CRM" },
  { href: "/prospects", icon: "🔍", label: "Prospección" },
  { href: "/settings", icon: "⚙️", label: "Ajustes" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen glass border-r border-white/5 p-4 gap-2 fixed left-0 top-0">
      <div className="px-3 py-4 mb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
          ImobSmart
        </h1>
      </div>

      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              active
                ? "glass-accent text-white"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}

      <div className="mt-auto">
        <Link
          href="/properties/new"
          className="flex items-center justify-center gap-2 gradient-button py-3 text-white font-semibold text-sm"
        >
          + Nuevo Inmueble
        </Link>
      </div>
    </aside>
  );
}
