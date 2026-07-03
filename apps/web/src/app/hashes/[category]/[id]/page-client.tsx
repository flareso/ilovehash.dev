"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hashCategorySlugToName, HASH_TOOLS, HASH_ALGORITHMS, type HashToolResource, type ParameterConfig } from "@/lib/hash-metadata";
import { categoryNameToSlug } from "@/lib/routing/slugs";
import { computeHashClient, computeSimilarityComparison, type HashResult } from "@/lib/hash/compute.client";
import { compareSimilarityHashes } from "@/lib/hash/similarity";
import { Copy, Hash, RefreshCw } from "lucide-react";
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

interface ComparisonResult {
  distance?: number;
  similarity?: number;
}

export default function HashToolPageClient({ params }: ItemPageProps) {
  const resolvedParams = use(params);
  // Hash computation state
  const [inputText, setInputText] = useState("Hello, World!");
  const [inputText2, setInputText2] = useState("Hello, World!");
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<HashResult | null>(null);
  const [result2, setResult2] = useState<HashResult | null>(null);
  const [outputFormat, setOutputFormat] = useState<"hex" | "base64">("hex");
  const [algorithmParams, setAlgorithmParams] = useState<Record<string, string | number>>({});
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

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

  const algorithmConfig = useMemo(() => {
    return HASH_ALGORITHMS[toolId];
  }, [toolId]);

  const uiMode = useMemo(() => {
    return algorithmConfig?.uiMode || 'standard';
  }, [algorithmConfig]);

  const isSimilarity = uiMode === 'similarity';
  const showVerify = !isSimilarity;

  // Initialize algorithm parameters with defaults
  useEffect(() => {
    if (algorithmConfig?.parameters) {
      const defaults: Record<string, string | number> = {};
      algorithmConfig.parameters.forEach((param) => {
        if (param.defaultValue !== undefined) {
          defaults[param.id] = param.defaultValue;
        }
      });
      setAlgorithmParams(defaults);
    }
  }, [algorithmConfig]);

  const relatedTools = useMemo<HashToolResource[]>(() => {
    if (!tool) return [];
    return HASH_TOOLS.filter(
      (t: HashToolResource) => t.category === tool.category && t.id !== tool.id,
    ).slice(0, 6);
  }, [tool]);

  // Generate random salt
  const generateRandomSalt = useCallback(() => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }, []);

  const computeHash = useCallback(async () => {
    if (!tool) return;

    if (isSimilarity) {
      // Similarity mode: compute both inputs
      if (!inputText.trim() || !inputText2.trim()) return;
      
      setIsComputing(true);
      try {
        const comparison = await computeSimilarityComparison(
          tool.id,
          inputText,
          inputText2,
          outputFormat
        );

        setResult(comparison.result1);
        setResult2(comparison.result2);

        // Compute similarity metrics
        const metrics = await compareSimilarityHashes(
          tool.id,
          comparison.hash1,
          comparison.hash2
        );
        setComparisonResult(metrics || null);

        setVerifyResult(null);
      } catch (error) {
        console.error("Hash computation error:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to compute hash",
        );
      } finally {
        setIsComputing(false);
      }
    } else {
      // Standard mode: compute single input
      if (!inputText.trim()) return;

      setIsComputing(true);
      try {
        const result = await computeHashClient(
          tool.id,
          inputText,
          outputFormat,
          algorithmParams
        );

        const finalResult: HashResult = {
          ...result,
          category: tool.category,
          outputLength: algorithmConfig?.outputLength || result.outputLength,
        };

        setResult(finalResult);
        setResult2(null);
        setComparisonResult(null);

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
    }
  }, [tool, inputText, inputText2, outputFormat, algorithmParams, isSimilarity, algorithmConfig]);

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

  const updateParam = useCallback((paramId: string, value: string | number) => {
    setAlgorithmParams((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  }, []);

  useEffect(() => {
    // Auto-compute when input changes
    const timer = setTimeout(() => {
      if (isSimilarity) {
        if (inputText.trim() && inputText2.trim()) {
          computeHash();
        }
      } else {
        if (inputText.trim()) {
          computeHash();
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, inputText2, computeHash, isSimilarity]);

  useEffect(() => {
    // Re-compute when format or parameters change
    if (result && result.format !== outputFormat) {
      computeHash();
    }
  }, [outputFormat, computeHash, result]);

  useEffect(() => {
    // Re-compute when parameters change
    if (algorithmParams && Object.keys(algorithmParams).length > 0) {
      const timer = setTimeout(() => {
        computeHash();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [algorithmParams, computeHash]);

  useEffect(() => {
    // Auto-verify when expected hash changes
    if (expectedHash.trim() && result && showVerify) {
      verifyHash();
    } else {
      setVerifyResult(null);
    }
  }, [expectedHash, verifyHash, result, showVerify]);

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
                {isSimilarity ? "Input Texts" : "Input Text"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              {isSimilarity ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="input-text-1" className="text-sm font-medium">
                      Text 1
                    </Label>
                      <textarea
                        id="input-text-1"
                        value={inputText}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                        placeholder="Enter first text..."
                        className="mt-2 w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
                        disabled={isComputing}
                      />
                  </div>
                  <div>
                    <Label htmlFor="input-text-2" className="text-sm font-medium">
                      Text 2
                    </Label>
                      <textarea
                        id="input-text-2"
                        value={inputText2}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText2(e.target.value)}
                        placeholder="Enter second text..."
                        className="mt-2 w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
                        disabled={isComputing}
                      />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="input-text" className="text-sm font-medium">
                    Text to hash
                  </Label>
                    <textarea
                      id="input-text"
                      value={inputText}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                      placeholder="Enter text to compute hash..."
                      className="mt-2 w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
                      disabled={isComputing}
                    />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parameters Section */}
          {algorithmConfig?.parameters && algorithmConfig.parameters.length > 0 && (
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
                  Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {algorithmConfig.parameters.map((param) => (
                  <div key={param.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor={`param-${param.id}`} className="text-sm font-medium">
                        {param.label}
                        {param.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {param.generateRandom && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const salt = generateRandomSalt();
                            updateParam(param.id, salt);
                          }}
                          className="h-7 text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                      )}
                    </div>
                    {param.type === 'textarea' ? (
                      <textarea
                        id={`param-${param.id}`}
                        value={String(algorithmParams[param.id] || '')}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateParam(param.id, e.target.value)}
                        placeholder={param.placeholder}
                        className="w-full p-3 border rounded-md resize-none font-mono text-sm"
                        disabled={isComputing}
                      />
                    ) : param.type === 'number' ? (
                      <Input
                        id={`param-${param.id}`}
                        type="number"
                        value={algorithmParams[param.id] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          updateParam(param.id, value);
                        }}
                        placeholder={param.placeholder}
                        min={param.min}
                        max={param.max}
                        className="font-mono text-sm"
                        disabled={isComputing}
                      />
                    ) : (
                      <Input
                        id={`param-${param.id}`}
                        type="text"
                        value={String(algorithmParams[param.id] || '')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParam(param.id, e.target.value)}
                        placeholder={param.placeholder}
                        className="font-mono text-sm"
                        disabled={isComputing}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Output Section */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
                Hash Output{isSimilarity ? 's' : ''}
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
              ) : isSimilarity ? (
                <div className="space-y-4">
                  {result && (
                    <div className="p-4 border rounded-md bg-muted/50 font-mono text-sm break-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground mb-1">
                            Hash 1 ({result.format})
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
                  )}
                  {result2 && (
                    <div className="p-4 border rounded-md bg-muted/50 font-mono text-sm break-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground mb-1">
                            Hash 2 ({result2.format})
                          </div>
                          <div className="text-foreground">{result2.hash}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result2.hash)}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
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

          {/* Similarity Comparison Section */}
          {isSimilarity && comparisonResult && (
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
                  Similarity Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {comparisonResult.similarity !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Similarity Score:</span>
                      <span className="text-lg font-bold">
                        {(comparisonResult.similarity * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${comparisonResult.similarity * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {comparisonResult.distance !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Distance:</span>
                    <span className="text-sm font-mono">{comparisonResult.distance}</span>
                  </div>
                )}
                {comparisonResult.similarity !== undefined && (
                  <div
                    className={`p-3 rounded-md text-sm ${
                      comparisonResult.similarity > 0.7
                        ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                        : comparisonResult.similarity > 0.4
                        ? "bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200"
                        : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                    }`}
                  >
                    {comparisonResult.similarity > 0.7
                      ? "✓ High similarity"
                      : comparisonResult.similarity > 0.4
                      ? "⚠ Moderate similarity"
                      : "✗ Low similarity"}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Verify Section */}
          {showVerify && (
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
          )}
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
