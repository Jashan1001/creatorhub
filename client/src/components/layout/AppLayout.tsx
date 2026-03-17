import type { ReactNode } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Layers, BarChart2,
  DollarSign, Settings, LogOut, ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard",           icon: LayoutDashboard, label: "Overview"  },
  { to: "/dashboard/builder",   icon: Layers,          label: "Builder"   },
  { to: "/dashboard/analytics", icon: BarChart2,       label: "Analytics" },
  { to: "/dashboard/monetize",  icon: DollarSign,      label: "Monetize"  },
  { to: "/dashboard/settings",  icon: Settings,        label: "Settings"  },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/login"); };

  const displayName = user?.name ?? "…";
  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden font-body text-[var(--text-primary)]">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]">

        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <h1 className="font-display text-lg font-bold text-[var(--accent)] tracking-tight">CreatorHub</h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-md
                text-sm transition-all duration-150 font-semibold
                ${isActive
                  ? "bg-[var(--accent)] text-[var(--text-inverse)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }
              `}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + actions */}
        <div className="mt-auto border-t border-[var(--border)] p-4 flex flex-col gap-2">
          {user && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md
                text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-hover)] transition-all duration-150"
            >
              <ExternalLink size={16} />
              View page
            </a>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md
              text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--danger)]
              hover:bg-[var(--danger)]/10 transition-all duration-150 w-full text-left"
          >
            <LogOut size={16} />
            Log out
          </button>

          {/* Avatar + name */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mt-2">
              <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden shadow-[var(--shadow-sm)] border border-[var(--accent-border)]">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[var(--text-primary)] truncate">{displayName}</span>
                <span className="text-xs text-[var(--text-muted)] font-medium truncate">@{user.username}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-6 md:p-8 max-w-5xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

    </div>
  );
};
