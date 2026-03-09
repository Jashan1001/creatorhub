"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const blocks = [
  "Profile Block",
  "Link Block",
  "Video Block",
  "Text Block",
  "Image Block",
]

export default function Builder() {
  return (
    <section className="py-28 bg-stone-100">

      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-3xl font-semibold text-zinc-900">
          Build Your Page Visually
        </h2>

        <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
          Drag blocks to design your creator page exactly the way you want.
        </p>

      </div>


      <div className="mt-16 grid md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6">


        {/* Block Library */}
        <Card className="border border-zinc-200 shadow-sm bg-white">

          <CardContent className="p-6">

            <h3 className="font-semibold text-zinc-900 mb-4">
              Blocks
            </h3>

            <div className="space-y-3">

              {blocks.map((block, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="p-3 border rounded-lg bg-white text-sm cursor-grab hover:bg-zinc-50 transition"
                >
                  {block}
                </motion.div>
              ))}

            </div>

          </CardContent>

        </Card>


        {/* Page Preview */}
        <Card className="border border-zinc-200 shadow-sm bg-white">

          <CardContent className="p-6">

            <h3 className="font-semibold text-zinc-900 mb-4">
              Your Page
            </h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >

              <div className="p-4 bg-zinc-100 rounded-lg text-center">
                Profile
              </div>

              <div className="p-3 bg-zinc-100 rounded-lg">
                YouTube Link
              </div>

              <div className="p-3 bg-zinc-100 rounded-lg">
                Portfolio
              </div>

              <div className="p-3 bg-zinc-100 rounded-lg">
                Support Me
              </div>

            </motion.div>

          </CardContent>

        </Card>

      </div>

    </section>
  )
}