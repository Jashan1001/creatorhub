import { Button } from "@/components/ui/button"
import GradientMesh from "@/components/ui/gradientMesh"

export default function Hero() {
  return (
    <section className="relative py-32 flex flex-col items-center justify-center text-center px-6 bg-stone-50 overflow-hidden">

      {/* Animated Gradient Background */}
      <GradientMesh />

      <div className="relative z-10">

        <h1 className="text-5xl font-semibold leading-tight md:text-6xl text-zinc-900">
          Your Entire Creator World <br />
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent">
            in One Link
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-zinc-600">
          Bring your links, content, and audience together in one
          simple creator page.
        </p>

        <div className="mt-8 flex gap-4 justify-center">

          <Button size="lg" className="transition hover:scale-[1.03]">
            Create Your Page
          </Button>

          <Button variant="outline" size="lg">
            View Demo
          </Button>

        </div>
        

      </div>

    </section>
  )
}