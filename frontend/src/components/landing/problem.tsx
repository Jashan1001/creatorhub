import { Link2, Video, ShoppingBag } from "lucide-react"

export default function Problem() {
  return (
    <section className="py-28">

      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-3xl font-semibold">
          Creators Are Everywhere
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Creators share content across many platforms — YouTube,
          portfolios, online stores, and social media.
          Managing all these links becomes messy.
        </p>

      </div>


      <div className="mt-16 mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-3">

        {/* Example 1 */}
        <div className="flex flex-col items-center text-center gap-3">

          <Link2 size={26} />

          <h3 className="font-medium">
            Multiple Links
          </h3>

          <p className="text-sm text-gray-600">
            Creators share links across many platforms and profiles.
          </p>

        </div>


        {/* Example 2 */}
        <div className="flex flex-col items-center text-center gap-3">

          <Video size={26} />

          <h3 className="font-medium">
            Content Everywhere
          </h3>

          <p className="text-sm text-gray-600">
            Videos, resources, courses, and content live in different places.
          </p>

        </div>


        {/* Example 3 */}
        <div className="flex flex-col items-center text-center gap-3">

          <ShoppingBag size={26} />

          <h3 className="font-medium">
            Monetization
          </h3>

          <p className="text-sm text-gray-600">
            Selling products, accepting support, and promoting content.
          </p>

        </div>

      </div>

    </section>
  )
}