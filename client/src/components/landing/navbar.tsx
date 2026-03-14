import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          CreatorHub
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <Link href="#features" className="text-sm text-stone-600 hover:text-stone-900">
            Features
          </Link>

          <Link href="#pricing" className="text-sm text-stone-600 hover:text-stone-900">
            Pricing
          </Link>

          <Link href="#docs" className="text-sm text-stone-600 hover:text-stone-900">
            Docs
          </Link>

          {/* Login */}
          <Link href="/login" className="text-sm text-stone-700 hover:text-stone-900">
            Login
          </Link>

          {/* Signup */}
          <Link href="/signup">
            <Button>
              Get Started
            </Button>
          </Link>

        </div>

      </div>
    </nav>
  )
}