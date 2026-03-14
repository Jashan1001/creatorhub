import { Request, Response } from "express";
import mongoose from "mongoose";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import { parseDevice, parseReferrer } from "../lib/deviceParser.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const trackEvent = async (req: Request, res: Response): Promise<void> => {
  res.json({ ok: true });

  const { type, creatorId, blockId } = req.body as {
    type: "page_view" | "link_click";
    creatorId: string;
    blockId?: string;
  };
  const userAgentHeader = req.headers["user-agent"];
  const referrerHeader = req.headers.referer;
  const userAgent = Array.isArray(userAgentHeader) ? userAgentHeader.join(" ") : userAgentHeader ?? "";
  const referrer = Array.isArray(referrerHeader) ? referrerHeader[0] ?? "" : referrerHeader ?? "";

  AnalyticsEvent.create({
    creatorId: new mongoose.Types.ObjectId(creatorId),
    type,
    blockId: blockId ? new mongoose.Types.ObjectId(blockId) : undefined,
    device: parseDevice(userAgent),
    referrer: parseReferrer(referrer),
  }).catch((err) => console.error("Analytics write failed:", err));
};

export const getSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const creatorId = new mongoose.Types.ObjectId(req.user!.id);
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [dailyStats, deviceBreakdown, topLinks, totals] = await Promise.all([
      AnalyticsEvent.aggregate([
        { $match: { creatorId, createdAt: { $gte: since } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              type: "$type",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { creatorId, type: "page_view", createdAt: { $gte: since } } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { creatorId, type: "link_click", createdAt: { $gte: since } } },
        { $group: { _id: "$blockId", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "blocks",
            localField: "_id",
            foreignField: "_id",
            as: "block",
          },
        },
        { $unwind: { path: "$block", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            clicks: 1,
            title: "$block.content.title",
            url: "$block.content.url",
          },
        },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { creatorId } },
        {
          $group: {
            _id: "$type",
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    const dailyMap: Record<string, { date: string; views: number; clicks: number }> = {};
    dailyStats.forEach(({ _id, count }: { _id: { date: string; type: string }; count: number }) => {
      if (!dailyMap[_id.date]) {
        dailyMap[_id.date] = { date: _id.date, views: 0, clicks: 0 };
      }
      if (_id.type === "page_view") dailyMap[_id.date].views = count;
      if (_id.type === "link_click") dailyMap[_id.date].clicks = count;
    });

    const totalViews = totals.find((total: { _id: string; total: number }) => total._id === "page_view")?.total ?? 0;
    const totalClicks = totals.find((total: { _id: string; total: number }) => total._id === "link_click")?.total ?? 0;

    res.json({
      daily: Object.values(dailyMap),
      devices: deviceBreakdown,
      topLinks,
      totals: { views: totalViews, clicks: totalClicks },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
