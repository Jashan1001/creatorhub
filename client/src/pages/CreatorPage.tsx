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
    bg: "#ffffff",
    surface: "#f9f9f7",
    text: "#0a0a0a",
    subtext: "#6b7280",
    border: "#e5e7eb",
    linkBg: "#0a0a0a",
    linkText: "#ffffff",
    linkHover: "#1a1a1a",
  },
  dark: {
    bg: "#0a0b0f",
    surface: "#111318",
    text: "#e8e8e0",
    subtext: "#8a8f9e",
    border: "#1f2330",
    linkBg: "#1a1d24",
    linkText: "#e8e8e0",
    linkHover: "#21252e",
  },
  gradient: {
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    surface: "rgba(255,255,255,0.1)",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.7)",
    border: "rgba(255,255,255,0.15)",
    linkBg: "rgba(255,255,255,0.15)",
    linkText: "#ffffff",
    linkHover: "rgba(255,255,255,0.25)",
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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border transition-all duration-150 group"
      style={{
        background: theme.linkBg,
        color: theme.linkText,
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-6 h-6 rounded-md flex items-center justify-center opacity-60 shrink-0" style={{ background: theme.border }}>
          <Link2 size={12} />
        </div>
        <span className="text-sm font-medium truncate">{(block.content.title as string) || "Link"}</span>
      </div>
      <ExternalLink size={14} className="opacity-40 group-hover:opacity-70 transition-opacity shrink-0" />
    </motion.a>
  );
};

const TextBlock = ({ block, theme }: { block: Block; theme: Theme }) => (
  <p className="text-sm text-center leading-relaxed" style={{ color: theme.subtext }}>
    {block.content.text as string}
  </p>
);

const ImageBlock = ({ block }: { block: Block }) => {
  const caption = block.content.caption as string | undefined;

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <img src={block.content.url as string} alt={caption || ""} className="w-full object-cover" />
      {caption ? <p className="text-xs text-center mt-2 opacity-60">{caption}</p> : null}
    </div>
  );
};

const VideoBlock = ({ block }: { block: Block }) => {
  const url = (block.content.url as string) ?? "";
  const embedUrl = url
    .replace("watch?v=", "embed/")
    .replace("youtu.be/", "youtube.com/embed/");

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden">
      <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video" />
    </div>
  );
};

const LockedBlock = ({
  theme,
  onSubscribeClick,
}: {
  theme: Theme;
  onSubscribeClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border cursor-pointer group"
    style={{ borderColor: theme.border, background: theme.surface }}
    onClick={onSubscribeClick}
  >
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#f59e0b1a" }}>
        <Lock size={12} className="text-amber-400" />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: theme.text }}>Subscribers only</p>
        <p className="text-xs opacity-50" style={{ color: theme.subtext }}>Subscribe to unlock this content</p>
      </div>
    </div>
    <span className="text-xs font-medium text-amber-400">Unlock -&gt;</span>
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
          name: "CreatorForge",
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#111318", border: "1px solid #1f2330" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b" style={{ borderColor: "#1f2330" }}>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-amber-400" />
            <h3 className="font-display font-bold text-white">Support {creatorName}</h3>
          </div>
          <p className="text-sm" style={{ color: "#8a8f9e" }}>
            Choose a tier to unlock exclusive content
          </p>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {tiers.map((tier) => (
            <motion.button
              key={tier._id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubscribe(tier)}
              disabled={!!loading}
              className="flex items-start justify-between w-full p-4 rounded-xl border text-left transition-all"
              style={{ borderColor: "#2d3344", background: "#1a1d24" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{tier.name}</span>
                  {loading === tier._id && (
                    <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                {tier.description && (
                  <p className="text-xs mb-2" style={{ color: "#8a8f9e" }}>
                    {tier.description}
                  </p>
                )}
                {tier.benefits.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "#8a8f9e" }}>
                        <CheckCircle2 size={11} className="text-amber-400 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="ml-4 shrink-0 text-right">
                <span className="text-sm font-bold text-amber-400">₹{(tier.price / 100).toLocaleString("en-IN")}</span>
                <span className="text-xs block" style={{ color: "#8a8f9e" }}>/month</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm rounded-xl transition-colors"
            style={{ color: "#8a8f9e", background: "#1a1d24" }}
          >
            Maybe later
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b0f]">
        <span className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0b0f] gap-3">
        <p className="font-display text-2xl font-bold text-white">404</p>
        <p className="text-[#8a8f9e] text-sm">Creator not found</p>
      </div>
    );
  }

  const { user, blocks, tiers, isSubscribed } = data;
  const theme = themeConfig[(user.theme as keyof typeof themeConfig) || "minimal"];
  const isGradient = user.theme === "gradient";

  return (
    <>
      <div className="min-h-screen py-16 px-4" style={{ background: theme.bg, color: theme.text }}>
        <div className="max-w-[480px] mx-auto flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-4"
          >
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-xl font-bold border-2"
              style={{
                background: isGradient ? "rgba(255,255,255,0.2)" : theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name[0]?.toUpperCase()
              )}
            </div>

            <h1 className="font-display text-xl font-bold mb-1" style={{ color: theme.text }}>{user.name}</h1>
            <p className="text-sm opacity-60 mb-2" style={{ color: theme.subtext }}>@{user.username}</p>

            {user.bio && (
              <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: theme.subtext }}>
                {user.bio}
              </p>
            )}

            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "#f59e0b1a", color: "#f59e0b" }}
              >
                <CheckCircle2 size={12} />
                Subscribed
              </motion.div>
            )}
          </motion.div>

          <div className="flex flex-col gap-3">
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
                {block.type === "paid_post" && (
                  <div className="rounded-xl border p-5" style={{ borderColor: theme.border, background: theme.surface }}>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: theme.text }}>
                      {(block.content.title as string) || "Exclusive post"}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: theme.subtext }}>
                      {block.content.text as string}
                    </p>
                  </div>
                )}
                {block.type === "locked" && (
                  <LockedBlock theme={theme} onSubscribeClick={() => setShowModal(true)} />
                )}
              </motion.div>
            ))}
          </div>

          {tiers.length > 0 && !isSubscribed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4">
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:opacity-90"
                style={{ background: "#f59e0b", color: "#0a0b0f" }}
              >
                Support {user.name.split(" ")[0]} - Subscribe
              </button>
            </motion.div>
          )}

          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs opacity-30 hover:opacity-60 transition-opacity"
              style={{ color: theme.text }}
            >
              <Zap size={10} />
              Made with CreatorForge
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

