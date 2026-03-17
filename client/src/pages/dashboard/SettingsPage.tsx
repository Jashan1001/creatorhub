import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Palette, Paintbrush } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";

const themes = [
  { id: "minimal", label: "Minimal (Light)", bg: "#ffffff", text: "#2a1a12" },
  { id: "dark", label: "Dark Mode", bg: "#1a1614", text: "#f5f0e8" },
  { id: "gradient", label: "Vibrant", bg: "linear-gradient(135deg,#a05c3e,#db9065)", text: "#ffffff" },
] as const;

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    theme: user?.theme ?? "minimal",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/user/profile", {
        name: form.name,
        bio: form.bio,
        theme: form.theme,
      });
      await refreshUser();
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl text-[var(--text-primary)]">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
          Manage your profile and page appearance
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-5">Profile Information</h3>
          
          <div className="flex flex-col gap-5">
            <Input label="Display name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" required />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[var(--text-secondary)]">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell your audience about yourself..."
                rows={4}
                maxLength={200}
                className="w-full px-3 py-2.5 text-sm resize-none bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all font-medium"
              />
              <p className="text-xs font-semibold text-[var(--text-muted)] self-end">
                {form.bio.length} / 200
              </p>
            </div>
            
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-sm font-bold text-[var(--text-secondary)]">
                Your public URL
              </label>
              <a
                href={`/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-bold text-[var(--accent)] bg-[var(--accent-muted)] hover:bg-[var(--bg-hover)] w-max px-3 py-1.5 rounded-md transition-colors"
              >
                creatorhub.co/@{user?.username}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-2 mb-5">
            <Palette size={20} className="text-[var(--accent)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Page Theme</h3>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setForm({ ...form, theme: t.id })}
                className={`flex flex-col gap-3 p-3 rounded-xl border-2 transition-all duration-150 text-left ${form.theme === t.id ? "border-[var(--accent)] bg-[var(--accent-muted)] shadow-[var(--shadow-sm)]" : "border-[var(--border)] hover:border-[var(--border-strong)]"}`}
              >
                <div className="w-full h-20 rounded-lg overflow-hidden border border-[var(--border-subtle)] relative" style={{ background: t.bg }}>
                  <div className="absolute top-3 left-3 flex flex-col gap-2 w-full pr-6">
                    <div className="w-12 h-3 rounded-full shadow-sm" style={{ background: t.text, opacity: 0.8 }} />
                    <div className="flex gap-1">
                      <div className="w-6 h-6 rounded-md shadow-sm" style={{ background: t.text, opacity: 0.2 }} />
                      <div className="w-16 h-6 rounded-md shadow-sm" style={{ background: t.text, opacity: 0.2 }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full px-1">
                   <span className="text-sm font-bold text-[var(--text-primary)]">
                    {t.label}
                  </span>
                  {form.theme === t.id && (
                     <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-inverse)] bg-[var(--accent)] px-2 py-0.5 rounded-full shadow-sm">Active</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--accent)] text-[var(--text-inverse)] px-8 py-3 rounded-lg text-sm font-bold hover:bg-[var(--accent-hover)] transition shadow-[var(--shadow-sm)] w-max disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
