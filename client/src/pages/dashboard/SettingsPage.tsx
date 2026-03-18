import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Palette, ExternalLink, Camera, Shield, AtSign, Upload } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";

const themes = [
  { id: "minimal",  label: "Minimal",  desc: "Clean white",  bg: "#ffffff",                                     text: "#0a0a0a", accent: "#0a0a0a" },
  { id: "dark",     label: "Dark",     desc: "Deep space",   bg: "#0a0b0f",                                     text: "#e8e8e0", accent: "#f59e0b" },
  { id: "gradient", label: "Gradient", desc: "Purple dream", bg: "linear-gradient(135deg,#667eea,#764ba2)",     text: "#ffffff", accent: "#ffffff" },
] as const;

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name:  user?.name  ?? "",
    bio:   user?.bio   ?? "",
    theme: user?.theme ?? "minimal",
  });
  const [saving,         setSaving]         = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview,  setAvatarPreview]  = useState<string | null>(user?.avatar ?? null);

  const initials = user?.name
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  // ── Avatar upload ───────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be under 3MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    // Read as base64 data URI
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      setAvatarPreview(dataUri);
      setUploadingAvatar(true);

      try {
        const res = await api.post<{ avatarUrl: string }>("/upload/avatar", { image: dataUri });
        setAvatarPreview(res.data.avatarUrl);
        await refreshUser();
        toast.success("Avatar updated");
      } catch (err: any) {
        toast.error(err.response?.data?.message ?? "Upload failed");
        setAvatarPreview(user?.avatar ?? null);
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Profile save ────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/user/profile", { name: form.name, bio: form.bio, theme: form.theme });
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
        <p className="text-sm text-(--text-secondary) mt-1">Manage your profile and page appearance</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* ── Profile ── */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <User size={15} className="text-(--text-muted)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">Profile</h3>
          </div>

          <div className="flex flex-col gap-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="w-16 h-16 rounded-full bg-(--bg-elevated) border-2 border-(--border) overflow-hidden">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center font-display text-lg font-bold text-(--text-muted)">
                        {initials}
                      </div>
                  }
                  {uploadingAvatar && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {!uploadingAvatar && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  <Upload size={13} />
                  {uploadingAvatar ? "Uploading…" : "Upload photo"}
                </Button>
                <p className="text-xs text-(--text-muted) mt-1.5">JPG, PNG or WebP · Max 3MB</p>
              </div>
            </div>

            <Input
              label="Display name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              icon={<User size={14} />}
              required
            />

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--text-secondary)">Bio</label>
                <span className={`text-xs tabular-nums ${form.bio.length > 180 ? "text-(--warning)" : "text-(--text-muted)"}`}>
                  {form.bio.length}/200
                </span>
              </div>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell your audience about yourself..."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2.5 text-sm resize-none bg-(--bg-elevated) text-(--text-primary) border border-(--border) rounded-md placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 focus:bg-(--bg-hover) transition-all duration-(--transition)"
              />
            </div>

            {/* Page URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--text-secondary)">Your page URL</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-(--bg-elevated) border border-(--border) rounded-md">
                <AtSign size={14} className="text-(--text-muted) shrink-0" />
                <a
                  href={`/${user?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline flex items-center gap-1.5 truncate"
                >
                  creatorforge.io/@{user?.username}
                  <ExternalLink size={11} className="shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Theme ── */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Palette size={15} className="text-(--text-muted)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">Page theme</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm({ ...form, theme: t.id })}
                className={`relative flex flex-col gap-2.5 p-3 rounded-lg border-2 text-left transition-all duration-(--transition) ${
                  form.theme === t.id
                    ? "border-accent shadow-(--shadow-accent)"
                    : "border-(--border) hover:border-(--border-strong)"
                }`}
              >
                <div className="w-full h-14 rounded-md overflow-hidden" style={{ background: t.bg }}>
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                    <div className="w-6 h-6 rounded-full opacity-60" style={{ background: t.text }} />
                    <div className="w-10 h-1 rounded-full opacity-50" style={{ background: t.text }} />
                    <div className="w-12 h-1.5 rounded-md opacity-30 mt-0.5" style={{ background: t.accent }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-(--text-primary)">{t.label}</p>
                  <p className="text-xs text-(--text-muted)">{t.desc}</p>
                </div>
                {form.theme === t.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-[8px] text-(--text-inverse) font-bold">✓</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </Card>

        {/* ── Account ── */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Shield size={15} className="text-(--text-muted)" />
            <h3 className="text-sm font-semibold text-(--text-primary)">Account</h3>
          </div>

          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-between py-3.5 border-b border-(--border-subtle)">
              <div>
                <p className="text-sm font-medium text-(--text-primary)">Plan</p>
                <p className="text-xs text-(--text-muted) mt-0.5">Your current subscription plan</p>
              </div>
              <Badge variant={user?.plan === "pro" ? "accent" : user?.plan === "business" ? "success" : "default"} dot>
                {user?.plan ?? "free"}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b border-(--border-subtle)">
              <div>
                <p className="text-sm font-medium text-(--text-primary)">Email</p>
                <p className="text-xs text-(--text-muted) mt-0.5">{user?.email}</p>
              </div>
              <Badge variant="success" dot>verified</Badge>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-medium text-(--text-primary)">Password</p>
                <p className="text-xs text-(--text-muted) mt-0.5">Change your login password</p>
              </div>
              <a href="/forgot-password" className="text-xs text-accent hover:underline font-medium">
                Change →
              </a>
            </div>
          </div>
        </Card>

        <Button type="submit" loading={saving} className="self-start">
          Save changes
        </Button>
      </form>
    </div>
  );
}