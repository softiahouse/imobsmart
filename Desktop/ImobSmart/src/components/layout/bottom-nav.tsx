"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Inicio" },
  { href: "/properties", icon: "🏢", label: "Inmuebles" },
  { href: "/properties/new", icon: "+", label: "Nuevo", isAction: true },
  { href: "/crm", icon: "📋", label: "CRM" },
  { href: "/prospects", icon: "🔍", label: "B2B" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[rgba(10,10,20,0.9)] backdrop-blur-xl border-t border-white/5 flex justify-around py-2 pb-6 z-50">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);

        if (item.isAction) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-5">
              <div className="w-12 h-12 rounded-2xl gradient-button flex items-center justify-center text-xl text-white">
                {item.icon}
              </div>
              <span className="text-xs text-zinc-500 mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center">
            <span className="text-lg">{item.icon}</span>
            <span className={`text-xs mt-1 ${active ? "text-accent" : "text-zinc-600"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
