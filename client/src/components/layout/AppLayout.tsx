import { useState, type ReactNode } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Layers, BarChart2, DollarSign,
  Settings, LogOut, Zap, ExternalLink, Menu, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

const navItems = [
  { to: "/dashboard",            icon: LayoutDashboard, label: "Overview"  },
  { to: "/dashboard/builder",    icon: Layers,          label: "Builder"   },
  { to: "/dashboard/analytics",  icon: BarChart2,       label: "Analytics" },
  { to: "/dashboard/monetize",   icon: DollarSign,      label: "Monetize"  },
  { to: "/dashboard/settings",   icon: Settings,        label: "Settings"  },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-(--border) shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center shadow-(--shadow-accent)">
            <Zap size={13} className="text-(--text-inverse)" />
          </div>
          <span className="font-display font-bold text-(--text-primary) tracking-tight">
            CreatorForge
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            onClick={onNavClick}
            className={({ isActive }) => `
              relative flex items-center gap-3 px-3 py-2.5 rounded-md
              text-sm transition-all duration-(--transition) group
              ${isActive
                ? "bg-(--accent-muted) text-(--accent) font-medium nav-active-indicator"
                : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-elevated)"
              }
            `}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-(--border) flex flex-col gap-1 shrink-0">
        {user && (
          <a
            href={`/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavClick}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm
              text-(--text-secondary) hover:text-(--text-primary)
              hover:bg-(--bg-elevated) transition-all duration-(--transition)"
          >
            <ExternalLink size={15} />
            View page
          </a>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm
            text-(--text-secondary) hover:text-(--danger)
            hover:bg-(--danger-muted) transition-all duration-(--transition) w-full text-left"
        >
          <LogOut size={15} />
          Log out
        </button>

        {/* User pill */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-md bg-(--bg-elevated) border border-(--border)">
            <div className="w-7 h-7 rounded-full bg-(--bg-hover) border border-(--border) overflow-hidden shrink-0">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-(--text-muted)">
                    {user.name[0]?.toUpperCase()}
                  </div>
              }
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-(--text-primary) truncate leading-tight">{user.name}</span>
              <span className="text-xs text-(--text-muted) truncate leading-tight">@{user.username}</span>
            </div>
            <Badge variant={user.plan === "pro" ? "accent" : user.plan === "business" ? "success" : "default"}>
              {user.plan}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-(--bg-base) overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-(--border) bg-(--bg-surface)">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-(--bg-surface) border-r border-(--border) lg:hidden"
            >
              <SidebarContent onNavClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile topbar */}
        <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-(--border) bg-(--bg-surface) shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-elevated) transition-all"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <Zap size={12} className="text-(--text-inverse)" />
            </div>
            <span className="font-display font-bold text-sm text-(--text-primary)">CreatorForge</span>
          </div>
          <div className="w-10" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 lg:p-8 max-w-6xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};