"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Youtube, Globe, Coffee } from "lucide-react"
import { motion } from "framer-motion"

export default function Preview() {
  return (
    <section className="py-28 bg-white">

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div>

          <h2 className="text-3xl font-semibold text-zinc-900">
            A Page Built For Your Audience
          </h2>

          <p className="mt-4 max-w-md text-zinc-600 leading-relaxed">
            Your CreatorHub becomes a single destination where your
            audience can explore everything you create — links,
            content, and ways to support you.
          </p>

          <ul className="mt-6 space-y-3 text-zinc-600">

            <li>• Share links and social media</li>

            <li>• Add videos and resources</li>

            <li>• Accept support and monetize</li>

          </ul>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex justify-center">

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >

            <Card className="w-[320px] rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition">

              <CardContent className="flex flex-col items-center gap-4 p-8">

                {/* Avatar */}
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                  alt="creator"
                  className="h-20 w-20 rounded-full object-cover"
                />

                {/* Name */}
                <h3 className="text-lg font-semibold text-zinc-900">
                  Jashan
                </h3>

                <p className="text-sm text-zinc-500">
                  Developer • Creator
                </p>

                {/* Links */}
                <div className="mt-4 w-full space-y-3">

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium hover:bg-zinc-50 transition">
                    <Youtube size={16} />
                    YouTube
                  </button>

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium hover:bg-zinc-50 transition">
                    <Globe size={16} />
                    Portfolio
                  </button>

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium hover:bg-zinc-50 transition">
                    <Coffee size={16} />
                    Support Me
                  </button>

                </div>

              </CardContent>

            </Card>

          </motion.div>

        </div>

      </div>

    </section>
  )
}