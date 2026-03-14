import { LayoutDashboard, BarChart3, DollarSign } from "lucide-react"

export default function Features() {
  return (
    <section className="py-28 bg-stone-100">

      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-3xl font-semibold text-zinc-900">
          Everything You Need in One Place
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-zinc-600">
          Build your creator hub, track engagement, and grow your audience
          with powerful built-in tools.
        </p>

      </div>


      <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">


        {/* Feature 1 */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

          <LayoutDashboard className="text-zinc-700" size={26} />

          <h3 className="mt-4 font-semibold text-lg">
            Page Builder
          </h3>

          <p className="mt-2 text-sm text-zinc-600">
            Create your creator page using a simple drag-and-drop
            block based builder.
          </p>

        </div>


        {/* Feature 2 */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

          <BarChart3 className="text-zinc-700" size={26} />

          <h3 className="mt-4 font-semibold text-lg">
            Analytics Dashboard
          </h3>

          <p className="mt-2 text-sm text-zinc-600">
            Understand how your audience interacts with your
            page using built-in analytics.
          </p>

        </div>


        {/* Feature 3 */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

          <DollarSign className="text-zinc-700" size={26} />

          <h3 className="mt-4 font-semibold text-lg">
            Monetization
          </h3>

          <p className="mt-2 text-sm text-zinc-600">
            Accept support, sell digital products,
            and monetize your audience easily.
          </p>

        </div>


      </div>

    </section>
  )
}