import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, BarChart3, DollarSign } from "lucide-react"

export default function Features() {
  return (
    <section className="bg-gray-50 py-20">

      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-center text-3xl font-bold">
          Everything Creators Need
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Build your creator hub, track performance, and monetize your audience.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          {/* Feature 1 */}
          <Card>
            <CardHeader className="flex items-center gap-3">
              <Link2 className="h-6 w-6 text-indigo-600" />
              <CardTitle>Page Builder</CardTitle>
            </CardHeader>

            <CardContent>
              Create beautiful creator pages using a simple drag-and-drop block system.
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardHeader className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>

            <CardContent>
              Track page views, link clicks, and engagement with powerful analytics.
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardHeader className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-indigo-600" />
              <CardTitle>Monetization Tools</CardTitle>
            </CardHeader>

            <CardContent>
              Accept donations, sell digital products, and grow your creator income.
            </CardContent>
          </Card>

        </div>

      </div>

    </section>
  )
}