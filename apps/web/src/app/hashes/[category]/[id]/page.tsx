"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hashCategorySlugToName, HASH_TOOLS, HASH_ALGORITHMS, type HashToolResource } from "@/lib/hash-metadata";
import { categoryNameToSlug } from "@/lib/routing/slugs";
import { computeHashClient, type HashResult } from "@/lib/hash/compute.client";
import { Copy, Hash } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ItemPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}


export default function HashToolPageClient({ params }: ItemPageProps) {
  const resolvedParams = use(params);
  // Hash computation state
  const [inputText, setInputText] = useState("Hello, World!");
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<HashResult | null>(null);
  const [outputFormat, setOutputFormat] = useState<"hex" | "base64">("hex");

  // Verify state
  const [expectedHash, setExpectedHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<{
    match: boolean;
    reason?: string;
  } | null>(null);

  const categorySlug = resolvedParams.category;
  const categoryName = hashCategorySlugToName(categorySlug);
  const toolId = resolvedParams.id;

  const tool = useMemo<HashToolResource | null>(() => {
    return HASH_TOOLS.find((t) => t.id === toolId) ?? null;
  }, [toolId]);

  const relatedTools = useMemo<HashToolResource[]>(() => {
    if (!tool) return [];
    return HASH_TOOLS.filter(
      (t) => t.category === tool.category && t.id !== tool.id,
    ).slice(0, 6);
  }, [tool]);

  const computeHash = useCallback(async () => {
    if (!tool || !inputText.trim()) return;

    setIsComputing(true);
    try {
      // Use the client-side hash computation utility
      const result = await computeHashClient(tool.id, inputText, outputFormat);

      // Update the result with the correct category from the tool
      const finalResult: HashResult = {
        ...result,
        category: tool.category,
        outputLength: HASH_ALGORITHMS[tool.id]?.outputLength || result.outputLength,
      };

      setResult(finalResult);

      // Clear verify result when computing new hash
      setVerifyResult(null);
    } catch (error) {
      console.error("Hash computation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to compute hash",
      );
    } finally {
      setIsComputing(false);
    }
  }, [tool, inputText, outputFormat]);

  const verifyHash = useCallback(() => {
    if (!result || !expectedHash.trim()) {
      setVerifyResult(null);
      return;
    }

    // Simple format validation for expected hash
    const isHexFormat = /^[0-9a-fA-F]+$/.test(expectedHash);
    const isBase64Format = /^[A-Za-z0-9+/]*={0,2}$/.test(expectedHash);

    if (!isHexFormat && !isBase64Format) {
      setVerifyResult({
        match: false,
        reason: "Invalid hash format (must be hex or base64)",
      });
      return;
    }

    const match = result.hash.toLowerCase() === expectedHash.toLowerCase();
    setVerifyResult({
      match,
      reason: match ? undefined : "Hash values don't match",
    });
  }, [result, expectedHash]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  }, []);

  useEffect(() => {
    // Auto-compute when input changes
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        computeHash();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, computeHash]);

  useEffect(() => {
    // Re-compute when format changes
    if (result && result.format !== outputFormat) {
      computeHash();
    }
  }, [outputFormat, computeHash]);

  useEffect(() => {
    // Auto-verify when expected hash changes
    if (expectedHash.trim() && result) {
      verifyHash();
    } else {
      setVerifyResult(null);
    }
  }, [expectedHash, verifyHash, result]);

  if (!tool) {
    return null;
  }

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title={tool.name}
        description={tool.description}
        breadcrumbs={[
          { label: "Hashes", href: "/hashes" },
          { label: categoryName, href: `/hashes/${categorySlug}` },
          {
            label: tool.name || "Loading...",
            href: `/hashes/${categorySlug}/${toolId}`,
          },
        ]}
        actions={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Hash className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="break-words">{tool.category}</span>
            </div>
          </div>
        }
      />

      <div className="min-h-screen grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
        <motion.div
          className="lg:col-span-2 space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Input Section */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
                Input Text
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div>
                <Label htmlFor="input-text" className="text-sm font-medium">
                  Text to hash
                </Label>
                <textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to compute hash..."
                  className="mt-2 w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
                  disabled={isComputing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
                Hash Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Format:</Label>
                <div className="flex gap-2">
                  <Button
                    variant={outputFormat === "hex" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOutputFormat("hex")}
                  >
                    Hex
                  </Button>
                  <Button
                    variant={outputFormat === "base64" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOutputFormat("base64")}
                  >
                    Base64
                  </Button>
                </div>
              </div>

              {isComputing ? (
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    Computing hash...
                  </div>
                </div>
              ) : result ? (
                <div className="p-4 border rounded-md bg-muted/50 font-mono text-sm break-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">
                        {result.algorithm.toUpperCase()} ({result.format})
                      </div>
                      <div className="text-foreground">{result.hash}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.hash)}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-muted/50 text-center text-muted-foreground">
                  Enter text above to compute hash
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verify Section */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
                Verify Hash
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div>
                <Label htmlFor="expected-hash" className="text-sm font-medium">
                  Expected {tool.name} hash
                </Label>
                <Input
                  id="expected-hash"
                  value={expectedHash}
                  onChange={(e) => setExpectedHash(e.target.value)}
                  placeholder={`Enter expected ${tool.name} hash...`}
                  className="mt-2 font-mono text-sm"
                />
              </div>

              {verifyResult && (
                <div
                  className={`p-3 rounded-md ${
                    verifyResult.match
                      ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                      : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {verifyResult.match ? "✓ Match" : "✗ No Match"}
                  </div>
                  {verifyResult.reason && (
                    <div className="text-xs mt-1 opacity-90">
                      {verifyResult.reason}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base sm:text-lg">
                Algorithm Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {tool.category}
              </Badge>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {tool.description}
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full text-xs sm:text-sm"
                >
                  <Link href={`/hashes/${categoryNameToSlug(tool.category)}`}>
                    View all in {tool.category}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {relatedTools.length > 0 && (
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base sm:text-lg">
                  Related Algorithms
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {relatedTools.map((relatedTool) => (
                  <Link
                    key={relatedTool.id}
                    href={`/hashes/${categoryNameToSlug(tool.category)}/${relatedTool.id}`}
                    className="block group"
                  >
                    <div className="relative overflow-hidden flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer group-hover:shadow-sm">
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {relatedTool.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80 transition-colors">
                            {relatedTool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

