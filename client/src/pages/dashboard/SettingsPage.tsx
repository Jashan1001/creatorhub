import { useState } from "react";
import { motion } from "framer-motion";
import { User, Palette, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const themes = [
  { id: "minimal", label: "Minimal", bg: "#ffffff", text: "#000000" },
  { id: "dark", label: "Dark", bg: "#0a0b0f", text: "#e8e8e0" },
  { id: "gradient", label: "Gradient", bg: "linear-gradient(135deg,#667eea,#764ba2)", text: "#ffffff" },
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
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-(--text-primary)">Settings</h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          Manage your profile and page appearance
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-(--text-muted)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">Profile</h3>
          </div>
          <div className="flex flex-col gap-4">
            <Input label="Display name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--text-secondary)">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell your audience about yourself..."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2.5 text-sm resize-none bg-(--bg-elevated) text-(--text-primary) border border-(--border) rounded-(--radius-md) placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition-all duration-(--transition)"
              />
              <p className="text-xs text-(--text-muted) self-end">
                {form.bio.length}/200
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--text-secondary)">
                Your page URL
              </label>
              <a
                href={`/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline"
              >
                creatorforge.vercel.app/@{user?.username}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </Card>

        {/* Theme */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Palette size={16} className="text-(--text-muted)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">Page theme</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm({ ...form, theme: t.id })}
                className={`flex flex-col gap-2 p-3 rounded-(--radius-lg) border-2 transition-all duration-(--transition) text-left ${form.theme === t.id ? "border-accent" : "border-(--border) hover:border-(--border-strong)"}`}
              >
                <div className="w-full h-12 rounded-md overflow-hidden" style={{ background: t.bg }}>
                  <div className="p-2 flex flex-col gap-1">
                    <div className="w-8 h-1.5 rounded-full opacity-60" style={{ background: t.text }} />
                    <div className="w-12 h-1 rounded-full opacity-40" style={{ background: t.text }} />
                  </div>
                </div>
                <span className="text-xs font-medium text-(--text-secondary)">
                  {t.label}
                </span>
              </motion.button>
            ))}
          </div>
        </Card>

        <Button type="submit" loading={saving} className="self-start">
          Save changes
        </Button>
      </form>
    </div>
  );
}

