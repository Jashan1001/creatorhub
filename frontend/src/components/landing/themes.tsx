import { Card, CardContent } from "@/components/ui/card"

export default function Themes() {
  return (
    <section className="py-28 bg-white">

      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-3xl font-semibold text-zinc-900">
          Choose Your Style
        </h2>

        <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
          Customize your creator page with themes and layouts
          that match your personality and brand.
        </p>

      </div>


      <div className="mt-16 grid max-w-6xl mx-auto gap-8 px-6 md:grid-cols-3">


        {/* Minimal Theme */}
        <Card className="rounded-2xl border border-zinc-200 bg-stone-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

          <CardContent className="p-6">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full bg-zinc-300 mx-auto"></div>

              <h3 className="mt-4 font-semibold text-zinc-900">
                Minimal
              </h3>

              <p className="text-sm text-zinc-600">
                Clean and simple layout
              </p>

            </div>


            <div className="mt-6 space-y-2">

              <div className="h-8 bg-zinc-200 rounded"></div>
              <div className="h-8 bg-zinc-200 rounded"></div>
              <div className="h-8 bg-zinc-200 rounded"></div>

            </div>

          </CardContent>

        </Card>



        {/* Dark Theme */}
        <Card className="rounded-2xl border border-zinc-200 bg-zinc-900 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

          <CardContent className="p-6">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full bg-zinc-700 mx-auto"></div>

              <h3 className="mt-4 font-semibold">
                Dark
              </h3>

              <p className="text-sm text-zinc-400">
                Bold dark theme
              </p>

            </div>


            <div className="mt-6 space-y-2">

              <div className="h-8 bg-zinc-700 rounded"></div>
              <div className="h-8 bg-zinc-700 rounded"></div>
              <div className="h-8 bg-zinc-700 rounded"></div>

            </div>

          </CardContent>

        </Card>



        {/* Creator Theme */}
        <Card className="rounded-2xl border border-zinc-200 bg-stone-50 shadow-sm transition hover:shadow-md hover:-translate-y-1 ">

          <CardContent className="p-6">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full bg-zinc-300 mx-auto"></div>

              <h3 className="mt-4 font-semibold text-zinc-900">
                Creator
              </h3>

              <p className="text-sm text-zinc-600">
                Designed for content creators
              </p>

            </div>


            <div className="mt-6 space-y-3">

              <div className="h-6 bg-zinc-200 rounded"></div>
              <div className="h-6 bg-zinc-200 rounded"></div>
              <div className="h-10 bg-zinc-300 rounded"></div>

            </div>

          </CardContent>

        </Card>


      </div>

    </section>
  )
}