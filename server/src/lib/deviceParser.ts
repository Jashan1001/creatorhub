export const parseDevice = (
  userAgent: string
): "desktop" | "mobile" | "tablet" | "unknown" => {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/.test(ua)) return "mobile";
  if (/mozilla|chrome|safari|firefox|msie|trident/.test(ua)) return "desktop";
  return "unknown";
};

export const parseReferrer = (referrer: string): string => {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return "unknown";
  }
};
