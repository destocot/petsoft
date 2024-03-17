"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", path: "/app/dashboard" },
  { label: "Account", path: "/app/account" },
];

export const AppHeader = () => {
  const activePathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-white/10 py-2">
      <Logo />
      <nav>
        <ul className="flex gap-2 text-xs">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  "rounded-sm px-2 py-1 text-white/70 hover:text-white",
                  {
                    "bg-black/10 text-white": route.path === activePathname,
                  },
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
