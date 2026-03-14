import { Link2, Video, ShoppingBag } from "lucide-react"

export default function Problem() {
  return (
    <section className="py-28 bg-stone-50">

      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-3xl font-semibold text-zinc-900">
          Creators Are Everywhere
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-zinc-600 leading-relaxed">
          Your content lives across many platforms — YouTube,
          portfolios, social media, and online stores.
          Managing everything in different places becomes overwhelming.
        </p>

      </div>


      <div className="mt-16 mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-3">

        <div className="flex flex-col items-center text-center gap-4">

          <Link2 size={28} className="text-zinc-700" />

          <h3 className="text-lg font-medium text-zinc-900">
            Multiple Platforms
          </h3>

          <p className="text-sm text-zinc-600 leading-relaxed">
            Your audience has to jump between profiles,
            websites, and social media to find your work.
          </p>

        </div>


        <div className="flex flex-col items-center text-center gap-4">

          <Video size={28} className="text-zinc-700" />

          <h3 className="text-lg font-medium text-zinc-900">
            Content Everywhere
          </h3>

          <p className="text-sm text-zinc-600 leading-relaxed">
            Videos, resources, courses, and projects
            are scattered across multiple platforms.
          </p>

        </div>


        <div className="flex flex-col items-center text-center gap-4">

          <ShoppingBag size={28} className="text-zinc-700" />

          <h3 className="text-lg font-medium text-zinc-900">
            Monetization Tools
          </h3>

          <p className="text-sm text-zinc-600 leading-relaxed">
            Donations, products, and promotions
            often live in completely separate systems.
          </p>

        </div>

      </div>

    </section>
  )
}