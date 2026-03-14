export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400">

      <div className="mx-auto max-w-6xl px-6 py-16">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Logo / About */}
          <div>

            <h3 className="text-white text-lg font-semibold">
              CreatorHub
            </h3>

            <p className="mt-4 text-sm leading-relaxed">
              Build your creator page, share everything in one place,
              and grow your audience with powerful tools.
            </p>

          </div>


          {/* Product */}
          <div>

            <h4 className="text-white font-medium">
              Product
            </h4>

            <ul className="mt-4 space-y-2 text-sm">

              <li className="hover:text-white cursor-pointer">
                Features
              </li>

              <li className="hover:text-white cursor-pointer">
                Analytics
              </li>

              <li className="hover:text-white cursor-pointer">
                Themes
              </li>

              <li className="hover:text-white cursor-pointer">
                Pricing
              </li>

            </ul>

          </div>


          {/* Resources */}
          <div>

            <h4 className="text-white font-medium">
              Resources
            </h4>

            <ul className="mt-4 space-y-2 text-sm">

              <li className="hover:text-white cursor-pointer">
                Documentation
              </li>

              <li className="hover:text-white cursor-pointer">
                Guides
              </li>

              <li className="hover:text-white cursor-pointer">
                Blog
              </li>

              <li className="hover:text-white cursor-pointer">
                Support
              </li>

            </ul>

          </div>


          {/* Company */}
          <div>

            <h4 className="text-white font-medium">
              Company
            </h4>

            <ul className="mt-4 space-y-2 text-sm">

              <li className="hover:text-white cursor-pointer">
                About
              </li>

              <li className="hover:text-white cursor-pointer">
                Careers
              </li>

              <li className="hover:text-white cursor-pointer">
                Privacy
              </li>

              <li className="hover:text-white cursor-pointer">
                Terms
              </li>

            </ul>

          </div>

        </div>


        {/* Bottom bar */}
        <div className="mt-12 border-t border-zinc-800 pt-6 text-sm flex flex-col md:flex-row items-center justify-between gap-4">

          <p>
            © {new Date().getFullYear()} CreatorHub. All rights reserved.
          </p>

          <div className="flex gap-6">

            <span className="hover:text-white cursor-pointer">
              Twitter
            </span>

            <span className="hover:text-white cursor-pointer">
              GitHub
            </span>

            <span className="hover:text-white cursor-pointer">
              LinkedIn
            </span>

          </div>

        </div>

      </div>

    </footer>
  )
}