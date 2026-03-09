import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, MousePointerClick, TrendingUp } from "lucide-react"

export default function Analytics() {
  return (
    <section className="py-28 bg-stone-100">

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">

        {/* LEFT CONTENT */}
        <div>

          <h2 className="text-3xl font-semibold text-zinc-900">
            Understand Your Audience
          </h2>

          <p className="mt-4 max-w-md text-zinc-600 leading-relaxed">
            Track how your audience interacts with your page and
            discover which links perform best.
          </p>

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3 text-zinc-700">
              <BarChart3 size={18} />
              Track page views
            </div>

            <div className="flex items-center gap-3 text-zinc-700">
              <MousePointerClick size={18} />
              Measure link clicks
            </div>

            <div className="flex items-center gap-3 text-zinc-700">
              <TrendingUp size={18} />
              Understand audience growth
            </div>

          </div>

        </div>


        {/* DASHBOARD PREVIEW */}
        <div className="flex justify-center">

          <Card className="w-[420px] rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition">

            <CardContent className="p-6">

              {/* Header */}
              <div className="flex items-center justify-between">

                <h3 className="font-semibold text-zinc-900">
                  Creator Analytics
                </h3>

                <span className="text-xs text-zinc-400">
                  Last 7 days
                </span>

              </div>


              {/* Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">

                <div>
                  <p className="text-xs text-zinc-500">Views</p>
                  <p className="text-lg font-semibold text-zinc-900">1.2K</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Clicks</p>
                  <p className="text-lg font-semibold text-zinc-900">420</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">CTR</p>
                  <p className="text-lg font-semibold text-zinc-900">8%</p>
                </div>

              </div>


              {/* Divider */}
              <div className="border-t border-zinc-200 my-6"></div>


              {/* Chart */}
            <div className="flex items-end justify-center gap-3 h-32 mt-2">

                <div className="w-2 rounded-md bg-zinc-300 h-[65%] transition hover:bg-zinc-800"></div>

                <div className="w-2 rounded-md bg-zinc-400 h-[42%] transition hover:bg-zinc-800"></div>

                <div className="w-2 rounded-md bg-zinc-500 h-[36%] transition hover:bg-zinc-800 "></div>

                <div className="w-2 rounded-md bg-zinc-600 h-[65%] transition hover:bg-zinc-800"></div>

                <div className="w-2 rounded-md bg-zinc-500 h-[58%] transition hover:bg-zinc-800"></div>

                <div className="w-2 rounded-md bg-zinc-700 h-[85%] transition hover:bg-zinc-800"></div>

            </div>

              <p className="mt-4 text-xs text-zinc-400 text-center">
                Preview of analytics dashboard
              </p>

            </CardContent>

          </Card>

        </div>

      </div>

    </section>
  )
}