import { Card, CardContent } from "@/components/ui/card"

export default function Themes() {
  return (
    <section className="py-28">

      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-3xl font-semibold">
          Choose Your Style
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Customize your creator page with different themes and layouts
          that match your personality and brand.
        </p>

      </div>


      <div className="mt-16 grid max-w-6xl mx-auto gap-8 px-6 md:grid-cols-3">


        {/* Minimal Theme */}
        <Card className="rounded-2xl border shadow-sm">

          <CardContent className="p-6">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto"></div>

              <h3 className="mt-4 font-semibold">Minimal</h3>

              <p className="text-sm text-gray-500">
                Clean and simple layout
              </p>

            </div>


            <div className="mt-6 space-y-2">

              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>

            </div>

          </CardContent>

        </Card>



        {/* Dark Theme */}
        <Card className="rounded-2xl border shadow-sm bg-black text-white">

          <CardContent className="p-6">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto"></div>

              <h3 className="mt-4 font-semibold">Dark</h3>

              <p className="text-sm text-gray-400">
                Bold dark theme
              </p>

            </div>


            <div className="mt-6 space-y-2">

              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded"></div>

            </div>

          </CardContent>

        </Card>



        {/* Creator Theme */}
        <Card className="rounded-2xl border shadow-sm">

          <CardContent className="p-6">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto"></div>

              <h3 className="mt-4 font-semibold">Creator</h3>

              <p className="text-sm text-gray-500">
                Designed for content creators
              </p>

            </div>


            <div className="mt-6 space-y-2">

              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>

            </div>

          </CardContent>

        </Card>


      </div>

    </section>
  )
}