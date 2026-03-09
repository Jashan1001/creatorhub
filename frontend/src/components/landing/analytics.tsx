import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, MousePointerClick, TrendingUp } from "lucide-react"

export default function Analytics() {
  return (
    <section className="py-28 bg-gray-50">

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">

        {/* LEFT CONTENT */}
        <div>

          <h2 className="text-3xl font-semibold">
            Understand Your Audience
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            CreatorHub provides built-in analytics so you can understand
            how your audience interacts with your page and which links
            perform best.
          </p>

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3 text-gray-700">
              <BarChart3 size={18} />
              Track page views
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <MousePointerClick size={18} />
              Measure link clicks
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <TrendingUp size={18} />
              Understand audience growth
            </div>

          </div>

        </div>


        {/* DASHBOARD PREVIEW */}
        <div className="flex justify-center">

          <Card className="w-[420px] rounded-2xl border shadow-sm bg-white">

            <CardContent className="p-6">

              {/* Header */}
              <div className="flex items-center justify-between">

                <h3 className="font-semibold">
                  Creator Analytics
                </h3>

                <span className="text-xs text-gray-400">
                  Last 7 days
                </span>

              </div>


              {/* Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">

                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-lg font-semibold">1.2K</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Clicks</p>
                  <p className="text-lg font-semibold">420</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="text-lg font-semibold">8%</p>
                </div>

              </div>


              {/* Divider */}
              <div className="border-t my-6"></div>


              {/* Chart */}
              <div className="flex items-end justify-between h-32">

                <div className="w-3 bg-gray-300 rounded h-[30%]"></div>
                <div className="w-3 bg-gray-400 rounded h-[45%]"></div>
                <div className="w-3 bg-gray-400 rounded h-[40%]"></div>
                <div className="w-3 bg-gray-500 rounded h-[70%]"></div>
                <div className="w-3 bg-gray-400 rounded h-[60%]"></div>
                <div className="w-3 bg-gray-600 rounded h-[85%]"></div>

              </div>

              <p className="mt-4 text-xs text-gray-400 text-center">
                Preview of analytics dashboard
              </p>

            </CardContent>

          </Card>

        </div>

      </div>

    </section>
  )
}