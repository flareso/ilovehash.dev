"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "motion/react";
import { ArrowRight, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Link from "next/link";

export function SubmitCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="w-full overflow-hidden my-12">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left space-y-2 lg:space-y-4 max-w-2xl"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            >
              Ready to Hash?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-muted-foreground max-w-prose"
            >
              Try computing a hash right now. Choose from various cryptographic
              hash algorithms. No data stored.
            </motion.p>
          </motion.div>
          <motion.div variants={itemVariants} className="w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto text-base">
                <Link href="/hashes/sha-2/sha256">
                  <Hash className="mr-2 h-5 w-5" />
                  <span>Try SHA-256</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base"
              >
                <Link href="/hashes">
                  <span>Browse All Tools</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
