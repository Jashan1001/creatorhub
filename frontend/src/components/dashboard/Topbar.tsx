"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Topbar() {

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8">

      {/* Search */}
      <div className="flex items-center gap-2 bg-stone-100 px-3 py-2 rounded-md w-72">

        <Search size={16} className="text-stone-500" />

        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-full"
        />

      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        <Bell className="text-stone-600 cursor-pointer" size={20} />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}