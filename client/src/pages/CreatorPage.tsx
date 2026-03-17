import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Link2, ExternalLink, CheckCircle2, Zap } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Block, SubscriptionTier, User } from "@/types";

interface CreatorPageData {
  user: User;
  blocks: Block[];
  tiers: SubscriptionTier[];
  isSubscribed: boolean;
}

const themeConfig = {
  minimal: {
    bg: "#FAF8F5", // bg-base
    surface: "#ffffff",
    text: "#2a1a12", // text-primary
    subtext: "#6b5040", // text-secondary
    border: "#c8bab0", // border
    linkBg: "#ede8df", // bg-elevated
    linkText: "#2a1a12",
    linkHover: "#dfd3c9", // border-subtle
    accent: "#a05c3e", // accent
  },
  dark: {
    bg: "#1a1614",
    surface: "#2a221f",
    text: "#f5f0e8",
    subtext: "#c8bab0",
    border: "#4b3c34",
    linkBg: "#3a2e28",
    linkText: "#fffdf8",
    linkHover: "#4b3c34",
    accent: "#d4a373",
  },
  gradient: {
    bg: "linear-gradient(135deg, #a05c3e 0%, #db9065 100%)",
    surface: "rgba(255,255,255,0.15)",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.85)",
    border: "rgba(255,255,255,0.25)",
    linkBg: "rgba(255,255,255,0.2)",
    linkText: "#ffffff",
    linkHover: "rgba(255,255,255,0.3)",
    accent: "#ffffff",
  },
} as const;

type Theme = (typeof themeConfig)[keyof typeof themeConfig];

const LinkBlock = ({ block, theme }: { block: Block; theme: Theme }) => {
  const handleClick = () => {
    api.post("/analytics/track", {
      type: "link_click",
      creatorId: block.userId,
      blockId: block._id,
    }).catch(() => {});
  };

  return (
    <motion.a
      href={(block.content.url as string) || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between w-full px-5 py-4 rounded-xl border transition-all duration-150 group shadow-sm hover:shadow-md"
      style={{
        background: theme.linkBg,
        color: theme.linkText,
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Link2 size={18} style={{ color: theme.text }} />
        <span className="text-sm font-bold truncate tracking-tight">{(block.content.title as string) || "Link"}</span>
      </div>
      <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
    </motion.a>
  );
};

const TextBlock = ({ block, theme }: { block: Block; theme: Theme }) => (
  <p className="text-sm text-center leading-relaxed font-semibold my-2" style={{ color: theme.text }}>
    {block.content.text as string}
  </p>
);

const ImageBlock = ({ block }: { block: Block }) => {
  const caption = block.content.caption as string | undefined;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm">
      <img src={block.content.url as string} alt={caption || ""} className="w-full object-cover" />
      {caption ? <p className="text-xs text-center mt-3 opacity-70 font-semibold">{caption}</p> : null}
    </div>
  );
};

const VideoBlock = ({ block }: { block: Block }) => {
  const url = (block.content.url as string) ?? "";
  const embedUrl = url
    .replace("watch?v=", "embed/")
    .replace("youtu.be/", "youtube.com/embed/");

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
      <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video" />
    </div>
  );
};

const HeaderBlock = ({ block, theme }: { block: Block; theme: Theme }) => (
  <h2 className="text-xl font-black text-center tracking-tight my-1" style={{ color: theme.text }}>
    {(block.content.text as string) || "Section"}
  </h2>
);

const SocialBlock = ({ block, theme }: { block: Block; theme: Theme }) => {
  const platform = (block.content.platform as string) || "social";
  const handle = ((block.content.handle as string) || "").replace(/^@+/, "");
  const url = getSocialUrl(platform, handle);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border transition-all duration-150 font-bold shadow-sm hover:shadow-md"
      style={{
        background: theme.linkBg,
        color: theme.linkText,
        borderColor: theme.border,
      }}
    >
      <span className="capitalize">{platform}</span>
      {handle ? <span className="opacity-80">@{handle}</span> : null}
    </motion.a>
  );
};

const DividerBlock = ({ block, theme }: { block: Block; theme: Theme }) => (
  <div className={block.content.spaced ? "my-6" : "my-3"}>
    <hr style={{ borderColor: theme.border, opacity: 0.7 }} />
  </div>
);

const LockedBlock = ({
  onSubscribeClick,
  theme
}: {
  onSubscribeClick: () => void;
  theme: Theme;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center justify-between w-full px-5 py-4 rounded-xl border-2 cursor-pointer group transition-all shadow-sm hover:shadow-md"
    style={{ borderColor: theme.accent, background: theme.surface }}
    onClick={onSubscribeClick}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-90 shadow-inner" style={{ background: theme.linkBg }}>
        <Lock size={16} style={{ color: theme.text }} />
      </div>
      <div>
        <p className="text-sm font-bold tracking-tight" style={{ color: theme.text }}>Exclusive content</p>
        <p className="text-xs mt-0.5 font-semibold" style={{ color: theme.subtext }}>Subscribe to unlock</p>
      </div>
    </div>
    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm" style={{ background: theme.accent, color: theme.bg === themeConfig.gradient.bg ? theme.bg : theme.surface }}>Unlock</span>
  </motion.div>
);

const SubscribeModal = ({
  tiers,
  creatorName,
  onClose,
  onSuccess,
}: {
  tiers: SubscriptionTier[];
  creatorName: string;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(tier._id);

    try {
      const res = await api.post("/subscriptions", { tierId: tier._id });
      const { subscriptionId, keyId } = res.data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const rzp = new (window as any).Razorpay({
          key: keyId,
          subscription_id: subscriptionId,
          name: "CreatorHub",
          description: `${tier.name} - ${creatorName}`,
          handler: async (response: any) => {
             await api.post("/subscriptions/verify", {
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              tierId: tier._id,
            });
            onSuccess();
          },
             modal: {
            ondismiss: () => setLoading(null),
          },
        });
        rzp.open();
      };
    } catch (err: any) {
      alert(err.response?.data?.message ?? "Failed to start checkout");
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 font-body"
      style={{ background: "rgba(42,26,18,0.6)", backdropFilter: "blur(4px)" }}
       onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-2xl overflow-hidden bg-[var(--bg-surface)] shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-base)]">
          <div className="flex items-center gap-2 mb-1">
             <Zap size={18} className="text-[var(--text-primary)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">Support {creatorName}</h3>
          </div>
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            Choose a tier to unlock their exclusive content
          </p>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {tiers.map((tier) => (
             <motion.button
              key={tier._id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubscribe(tier)}
              disabled={!!loading}
              className="flex items-start justify-between w-full p-4 rounded-xl border border-[var(--border)] text-left transition-all hover:border-[var(--accent)] hover:shadow-[var(--shadow-sm)] bg-[var(--bg-surface)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <span className="font-display text-base font-bold text-[var(--text-primary)]">{tier.name}</span>
                  {loading === tier._id && (
                     <span className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                {tier.description && (
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3 leading-relaxed">
                    {tier.description}
                  </p>
                )}
                {tier.benefits.length > 0 && (
                  <ul className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-[var(--border-subtle)]">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                         <CheckCircle2 size={14} className="text-[var(--success)] shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="ml-4 shrink-0 text-right">
                <span className="font-display text-lg font-black text-[var(--text-primary)]">₹{(tier.price / 100).toLocaleString("en-IN")}</span>
                <span className="text-xs font-bold text-[var(--text-muted)] block mt-0.5">/ month</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
          >
            Not right now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CreatorPage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<CreatorPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    try {
      const res = await api.get(`/public/${username}`);
      setData(res.data);

      api.post("/analytics/track", {
        type: "page_view",
        creatorId: res.data.user._id,
      }).catch(() => {});
    } catch (err: any) {
      if (err.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [username]);

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <span className="w-8 h-8 border-[3px] border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] gap-2 font-display">
        <p className="text-4xl font-black text-[var(--text-primary)] tracking-tight">404</p>
        <p className="text-[var(--text-secondary)] font-bold">This page doesn't exist.</p>
      </div>
    );
  }

  const { user, blocks, tiers, isSubscribed } = data;
  const theme = themeConfig[(user.theme as keyof typeof themeConfig) || "minimal"];

  return (
    <>
      <div className="min-h-screen py-16 md:py-24 px-4 sm:px-6 font-body" style={{ background: theme.bg, color: theme.text }}>
        <div className="max-w-[420px] mx-auto flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="text-center mb-6"
          >
             <div
              className="w-24 h-24 rounded-full mx-auto mb-5 overflow-hidden flex items-center justify-center text-3xl font-extrabold shadow-md"
              style={{
                background: theme.surface,
                 borderColor: theme.border,
                borderWidth: "2px",
                 color: theme.accent,
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name[0]?.toUpperCase()
              )}
            </div>

            <h1 className="font-display text-3xl font-black tracking-tight mb-1" style={{ color: theme.text }}>{user.name}</h1>
            <p className="text-sm font-bold opacity-80 mb-4 tracking-wide" style={{ color: theme.subtext }}>@{user.username}</p>

            {user.bio && (
              <p className="text-sm leading-relaxed max-w-sm mx-auto font-semibold" style={{ color: theme.text, opacity: 0.9 }}>
                {user.bio}
              </p>
            )}

            {isSubscribed && (
              <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 mt-5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                 style={{ background: theme.accent, color: theme.bg === themeConfig.gradient.bg ? theme.bg : theme.surface, opacity: 0.95 }}
              >
                <CheckCircle2 size={12} />
                Subscribed
              </motion.div>
            )}
          </motion.div>

          <div className="flex flex-col gap-4">
            {blocks.map((block, i) => (
              <motion.div
                 key={block._id}
                 initial={{ opacity: 0, y: 12 }}
                 animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              >
                {block.type === "link" && <LinkBlock block={block} theme={theme} />}
                {block.type === "text" && <TextBlock block={block} theme={theme} />}
                 {block.type === "image" && <ImageBlock block={block} />}
                {block.type === "video" && <VideoBlock block={block} />}
                {block.type === "header" && <HeaderBlock block={block} theme={theme} />}
                {block.type === "social" && <SocialBlock block={block} theme={theme} />}
                {block.type === "divider" && <DividerBlock block={block} theme={theme} />}
                 {block.type === "paid_post" && (
                   <div className="rounded-xl border-2 p-5 shadow-sm bg-opacity-90" style={{ borderColor: theme.border, background: theme.surface }}>
                     <h3 className="font-display text-lg font-bold tracking-tight mb-2" style={{ color: theme.text }}>
                       {(block.content.title as string) || "Exclusive update"}
                     </h3>
                    <p className="text-sm leading-relaxed font-semibold mt-2" style={{ color: theme.text, opacity: 0.9 }}>
                      {block.content.text as string}
                    </p>
                  </div>
                )}
                 {block.type === "locked" && (
                  <LockedBlock onSubscribeClick={() => setShowModal(true)} theme={theme} />
                )}
              </motion.div>
            ))}
          </div>

          {tiers.length > 0 && !isSubscribed && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 pt-8 border-t" style={{ borderColor: theme.border }}>
               <button
                onClick={() => setShowModal(true)}
                 className="w-full py-4 rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
                style={{ background: theme.accent, color: theme.bg === themeConfig.gradient.bg ? theme.bg : theme.surface }}
              >
                Become a supporter
              </button>
            </motion.div>
          )}

          <div className="text-center mt-12 pb-4">
            <a
              href="/"
               className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-100 opacity-50"
               style={{ color: theme.text }}
            >
              <Zap size={10} />
              Made with CreatorHub
            </a>
          </div>
        </div>
      </div>

       <AnimatePresence>
        {showModal && (
          <SubscribeModal
            tiers={tiers}
            creatorName={user.name}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function getSocialUrl(platform: string, handle: string): string {
  if (!handle) return "#";

  const map: Record<string, string> = {
    twitter: `https://twitter.com/${handle}`,
    instagram: `https://instagram.com/${handle}`,
    youtube: `https://youtube.com/@${handle}`,
    tiktok: `https://tiktok.com/@${handle}`,
    github: `https://github.com/${handle}`,
    linkedin: `https://linkedin.com/in/${handle}`,
  };

  return map[platform.toLowerCase()] || "#";
}
