"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Youtube, Globe, Coffee } from "lucide-react"
import { motion } from "framer-motion"

export default function Preview() {
  return (
    <section className="py-24">

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div>

          <h2 className="text-3xl font-bold">
            Build Your Creator Page
          </h2>

          <p className="mt-4 text-gray-600">
            Share all your links, content, and resources in one place.
            CreatorHub makes it simple to build a page your audience can explore.
          </p>

          <ul className="mt-6 space-y-3 text-gray-700">

            <li>• Share links and social media</li>

            <li>• Add videos and resources</li>

            <li>• Accept donations and monetize</li>

          </ul>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex justify-center">

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >

            <Card className="w-[320px] rounded-2xl border shadow-lg hover:shadow-xl transition">

              <CardContent className="flex flex-col items-center gap-4 p-8">

                {/* Avatar */}
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                  alt="creator"
                  className="h-20 w-20 rounded-full object-cover shadow"
                />

                {/* Name */}
                <h3 className="text-lg font-semibold">
                  Jashan
                </h3>

                <p className="text-sm text-gray-500">
                  Developer • Creator
                </p>

                {/* Links */}
                <div className="mt-4 w-full space-y-3">

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium hover:bg-gray-100">
                    <Youtube size={16} />
                    YouTube
                  </button>

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium hover:bg-gray-100">
                    <Globe size={16} />
                    Portfolio
                  </button>

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium hover:bg-gray-100">
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