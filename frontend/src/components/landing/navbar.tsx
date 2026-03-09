import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="w-full border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">

        <h1 className="text-xl font-bold">CreatorHub</h1>

        <div className="flex items-center gap-6">
          <Link href="#">Features</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Docs</Link>

          <Button>Get Started</Button>
        </div>

      </div>
    </nav>
  )
}