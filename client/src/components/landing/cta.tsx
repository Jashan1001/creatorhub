import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-24 bg-stone-50">

      <div className="mx-auto max-w-4xl px-6 text-center">

        <h2 className="text-3xl font-semibold text-zinc-900">
          Start Your CreatorHub
        </h2>

        <p className="mt-3 text-zinc-600">
          Build your creator page in minutes.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Button size="lg">
            Create Your Page
          </Button>

          <Button variant="ghost" size="lg">
            View Demo
          </Button>

        </div>

      </div>

    </section>
  )
}