"use client"

import { motion } from "framer-motion"

export default function GradientMesh() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      {/* Blob 1 */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-zinc-200 rounded-full blur-[140px] opacity-40"
      />

      {/* Blob 2 */}
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-zinc-300 rounded-full blur-[140px] opacity-40"
      />

    </div>
  )
}