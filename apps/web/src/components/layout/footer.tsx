"use client";

import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HASH_TOOLS } from "@/lib/hash-metadata";
import { categoryNameToSlug } from "@/lib/routing/slugs";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { Button } from "../ui/button";

export function Footer() {
  const categories = useMemo(() => {
    const byCategory = new Set<string>();
    for (const tool of HASH_TOOLS) byCategory.add(tool.category);
    return Array.from(byCategory)
      .sort((a, b) => a.localeCompare(b))
      .map((title) => ({ title, slug: categoryNameToSlug(title) }));
  }, []);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    {
      name: "GitHub",
      href: "https://github.com/flareso/ilovehash.dev",
      external: true,
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/flareso/ilovehash.dev",
      icon: Github,
    },
  ];

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container mx-auto px-4 py-8 md:py-12"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <img
                src="/logo.png"
                alt="logo"
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-bold">ilovehash.dev</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Compute and verify cryptographic hashes. No data stored.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    {link.name}
                    {link.external && (
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories Preview */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.title}>
                  <Link
                    href={`/hashes/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    {category.title}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories Preview */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(6, 12).map((category) => (
                <li key={category.title}>
                  <Link
                    href={`/hashes/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    {category.title}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Actions */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <div key={social.name} className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {social.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <span className="text-xs text-muted-foreground">Theme</span>
              </div>
            </div>
          </motion.div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} ilovehash.dev. All rights
              reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Built with Next.js & shadcn/ui</span>
            <span>•</span>
            <span>Powered by Node.js & Vercel</span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
