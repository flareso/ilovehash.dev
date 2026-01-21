"use client";

import { motion } from "motion/react";
import Image from "next/image";

// Orchestrates the entire hero section animation
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger each line of text
      staggerChildren: 0.15,
    },
  },
};

// Standard animation for text elements
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function Hero() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4 text-center"
      variants={heroContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div
        variants={textVariants}
        className="mb-4"
      >
        <div className="relative h-32 sm:h-48 md:h-64 w-[256px] sm:w-[384px] md:w-[512px] mx-auto">
          <Image
            src="/logo.png"
            alt="ilovehash.dev logo"
            fill
            priority
            sizes="(min-width: 768px) 512px, (min-width: 640px) 384px, 256px"
            className="object-contain"
          />
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div className="space-y-2">
        <motion.h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl"
          variants={textVariants}
        >
          ilovehash.dev
        </motion.h1>
        <motion.p
          className="max-w-[900px] text-muted-foreground mb-4"
          variants={textVariants}
        >
          Compute, verify, and explore cryptographic hash functions.
        </motion.p>
        <motion.p
          className="text-sm text-muted-foreground"
          variants={textVariants}
        >
          Open source • Instant results • No data stored • Secure and private
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
