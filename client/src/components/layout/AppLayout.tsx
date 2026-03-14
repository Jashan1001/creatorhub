import { ReactNode } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Layers, BarChart2,
  DollarSign, Settings, LogOut, Zap, ExternalLink,
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

  return (
    <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden">

      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]">

        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <Zap size={14} className="text-[var(--text-inverse)]" />
            </div>
            <span className="font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              CreatorForge
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]
                text-sm transition-all duration-[var(--transition)]
                ${isActive
                  ? "bg-[var(--accent-muted)] text-[var(--accent)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                }
              `}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + actions */}
        <div className="p-3 border-t border-[var(--border)] flex flex-col gap-1">
          {user && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]
                text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-elevated)] transition-all duration-[var(--transition)]"
            >
              <ExternalLink size={16} />
              View page
            </a>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]
              text-sm text-[var(--text-secondary)] hover:text-[var(--danger)]
              hover:bg-[var(--danger)]/5 transition-all duration-[var(--transition)] w-full text-left"
          >
            <LogOut size={16} />
            Log out
          </button>

          {/* Avatar + name */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mt-1">
              <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden flex-shrink-0">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-muted)] font-medium">{user.name[0]}</div>
                }
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[var(--text-primary)] truncate">{user.name}</span>
                <span className="text-xs text-[var(--text-muted)] truncate">@{user.username}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-8 max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

    </div>
  );
};
