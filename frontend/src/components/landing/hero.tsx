import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center text-center px-6">

      {/* background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to- from-indigo-50 via-white to-white" />

      <h1 className="text-5xl font-bold leading-tight md:text-6xl">
        Your Entire Creator World <br />
        <span className="text-indigo-600">in One Link</span>
      </h1>

      <p className="mt-6 max-w-xl text-gray-600 text-lg">
        Build a beautiful page for your links, content, and audience.
        CreatorHub helps creators grow and monetize easily.
      </p>

      <div className="mt-8 flex gap-4">
        <Button size="lg">Create Your Page</Button>

        <Button variant="outline" size="lg">
          View Demo
        </Button>
      </div>

    </section>
  )
}