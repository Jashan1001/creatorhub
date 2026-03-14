"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Link2,
  Wand2,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

export default function Sidebar() {

  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Page", href: "/dashboard/page", icon: Link2 },
    { name: "Builder", href: "/dashboard/builder", icon: Wand2 },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-stone-200">
        <h1 className="text-lg font-semibold text-stone-900">
          CreatorHub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">

        {navItems.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
              ${
                active
                  ? "bg-stone-200 text-stone-900"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}

      </nav>

      {/* User profile */}
      <div className="mt-auto border-t border-stone-200 p-4 flex items-center gap-3">

        <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm">
          J
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-stone-900">
            Jashan
          </span>
          <span className="text-xs text-stone-500">
            Creator
          </span>
        </div>

      </div>

    </aside>
  );
}