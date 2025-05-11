"use client";

import { BrainCog, House, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/protected", icon: House },
    { name: "Partisipan", href: "/product", icon: UserRound },
  ];

  return (
    <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-4">
      <div className="flex items-center h-16 gap-10">
        <div className="hidden md:flex items-center space-x-6 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-stone-800 text-white hover:bg-stone-700"
                    : "text-stone-900 hover:text-stone-500"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div>{/* logout button */}</div>
    </nav>
  );
}
