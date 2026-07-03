"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { HASH_TOOLS, HASH_ALGORITHMS } from "@/lib/hash-metadata";
import { computeHashWithTiming, computeHashClient, type HashResult } from "@/lib/hash/compute.client";
import { Copy, Hash, Loader2, TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface CompareResult extends HashResult {
  executionTime?: number;
  isComputing?: boolean;
}

type SortBy = "speed" | "name" | "category";
type SortOrder = "asc" | "desc";

export default function ComparePage() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [inputText, setInputText] = useState("Hello, World!");
  const [outputFormat, setOutputFormat] = useState<"hex" | "base64">("hex");
  const [iterations, setIterations] = useState<number>(100);
  const [results, setResults] = useState<Map<string, CompareResult>>(new Map());
  const [isComputing, setIsComputing] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("speed");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const debouncedInputText = useDebounce(inputText, 500);

  // Prepare options for MultiSelect
  const algorithmOptions = useMemo(() => {
    return HASH_TOOLS.map((tool) => ({
      label: tool.name,
      value: tool.id,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, []);


  // Compute hash with multiple iterations for benchmarking
  const computeHashWithIterations = useCallback(async (
    algorithm: string,
    input: string,
    format: "hex" | "base64",
    iterations: number
  ): Promise<HashResult> => {
    const startTime = performance.now();

    try {
      let finalResult: HashResult | null = null;

      // Run the hash computation multiple times (but keep only the last result)
      for (let i = 0; i < iterations; i++) {
        finalResult = await computeHashClient(algorithm, input, format);
      }

      // Ensure we have a result (should always be true after the loop)
      if (!finalResult) {
        finalResult = await computeHashClient(algorithm, input, format);
      }

      const endTime = performance.now();

      return {
        ...finalResult,
        executionTime: endTime - startTime,
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        hash: "",
        algorithm,
        format,
        inputLength: input.length,
        outputLength: 0,
        category: "",
        executionTime: endTime - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, []);

  // Compute all selected hashes in parallel
  const computeAllHashes = useCallback(async () => {
    if (selectedAlgorithms.length === 0 || !debouncedInputText.trim()) {
      setResults(new Map());
      return;
    }

    setIsComputing(true);
    const newResults = new Map<string, CompareResult>();

    // Initialize all results as computing
    selectedAlgorithms.forEach((algoId) => {
      const tool = HASH_TOOLS.find((t) => t.id === algoId);
      newResults.set(algoId, {
        hash: "",
        algorithm: algoId,
        format: outputFormat,
        inputLength: debouncedInputText.length,
        outputLength: 0,
        category: tool?.category || "",
        executionTime: 0,
        isComputing: true,
      });
    });
    setResults(newResults);

    // Compute all hashes with staggered timing to avoid interference
    const computedResults: Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }> = [];

    for (let i = 0; i < selectedAlgorithms.length; i++) {
      const algoId = selectedAlgorithms[i];
      const tool = HASH_TOOLS.find((t) => t.id === algoId);

      try {
        // Add a small delay between computations to stagger timing
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }

        const result = await computeHashWithIterations(algoId, debouncedInputText, outputFormat, iterations);
        computedResults.push({
          status: 'fulfilled',
          value: {
            algorithm: algoId,
            result: {
              ...result,
              category: tool?.category || "",
              outputLength: HASH_ALGORITHMS[algoId]?.outputLength || result.outputLength,
              isComputing: false,
            },
          },
        });
      } catch (error) {
        computedResults.push({
          status: 'rejected',
          reason: error,
          value: {
            algorithm: algoId,
            result: {
              hash: "",
              algorithm: algoId,
              format: outputFormat,
              inputLength: debouncedInputText.length,
              outputLength: 0,
              category: tool?.category || "",
              executionTime: 0,
              error: error instanceof Error ? error.message : "Unknown error",
              isComputing: false,
            },
          },
        });
      }
    }
    const finalResults = new Map<string, CompareResult>();

    computedResults.forEach((settled) => {
      const algoId = settled.value.algorithm;
      if (settled.status === "fulfilled") {
        finalResults.set(algoId, settled.value.result);
      } else {
        finalResults.set(algoId, settled.value.result);
      }
    });

    setResults(finalResults);
    setIsComputing(false);
  }, [selectedAlgorithms, debouncedInputText, outputFormat, iterations]);

  // Auto-compute when input or format changes
  useEffect(() => {
    computeAllHashes();
  }, [computeAllHashes]);

  // Sort results
  const sortedResults = useMemo(() => {
    const resultsArray = Array.from(results.values());
    if (resultsArray.length === 0) return [];

    return [...resultsArray].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "speed":
          comparison = (a.executionTime || 0) - (b.executionTime || 0);
          break;
        case "name":
          const toolA = HASH_TOOLS.find((t) => t.id === a.algorithm);
          const toolB = HASH_TOOLS.find((t) => t.id === b.algorithm);
          comparison = (toolA?.name || "").localeCompare(toolB?.name || "");
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [results, sortBy, sortOrder]);

  // Find fastest and slowest
  const fastest = useMemo(() => {
    const validResults = sortedResults.filter((r) => !r.error && r.executionTime > 0);
    if (validResults.length === 0) return null;
    return validResults.reduce((prev, curr) =>
      curr.executionTime < prev.executionTime ? curr : prev
    );
  }, [sortedResults]);

  const slowest = useMemo(() => {
    const validResults = sortedResults.filter((r) => !r.error && r.executionTime > 0);
    if (validResults.length === 0) return null;
    return validResults.reduce((prev, curr) =>
      curr.executionTime > prev.executionTime ? curr : prev
    );
  }, [sortedResults]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  }, []);

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const formatTime = (ms: number): string => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)} μs`;
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  const getSortIcon = (column: SortBy) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Compare Hashes"
        description="Select multiple hash algorithms and compare their performance and outputs on the same input"
        breadcrumbs={[
          { label: "Hashes", href: "/hashes" },
          { label: "Compare", href: "/compare" },
        ]}
      />

      <div className="space-y-6 sm:space-y-8">
        {/* Algorithm Selection */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
              Select Algorithms
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="algorithm-select" className="text-sm font-medium">
                Choose algorithms to compare ({selectedAlgorithms.length} selected)
              </Label>
              <div className="w-full">
                <MultiSelect
                  options={algorithmOptions}
                  onValueChange={setSelectedAlgorithms}
                  defaultValue={selectedAlgorithms}
                  placeholder="Select hash algorithms to compare..."
                  maxCount={5}
                  className="w-full max-w-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Format:</Label>
              <div className="flex gap-2">
                <Button
                  variant={outputFormat === "hex" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOutputFormat("hex")}
                  disabled={isComputing}
                >
                  Hex
                </Button>
                <Button
                  variant={outputFormat === "base64" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOutputFormat("base64")}
                  disabled={isComputing}
                >
                  Base64
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benchmark Configuration */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
              Benchmark Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              <Label htmlFor="iterations" className="text-sm font-medium">
                Number of iterations
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="iterations"
                  type="number"
                  min="1"
                  max="100000"
                  value={iterations}
                  onChange={(e) => setIterations(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-2 border rounded-md text-sm"
                  disabled={isComputing}
                />
                <span className="text-sm text-muted-foreground">
                  Run each hash algorithm this many times to measure performance
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground self-center">Quick presets:</span>
                {[1, 10, 100, 1000, 10000].map((preset) => (
                  <Button
                    key={preset}
                    variant={iterations === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIterations(preset)}
                    disabled={isComputing}
                    className="text-xs h-7"
                  >
                    {preset.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {selectedAlgorithms.length > 0 ? (
          <Card>
            <CardHeader className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
                  Results ({sortedResults.length})
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("speed")}
                    className="text-xs sm:text-sm"
                  >
                    Speed {getSortIcon("speed")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className="text-xs sm:text-sm"
                  >
                    Name {getSortIcon("name")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("category")}
                    className="text-xs sm:text-sm"
                  >
                    Category {getSortIcon("category")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isComputing && sortedResults.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Computing hashes...</p>
                  </div>
                </div>
              ) : sortedResults.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No results yet. Select algorithms and enter input text.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-sm font-medium">Algorithm</th>
                          <th className="text-left p-3 text-sm font-medium">Category</th>
                          <th className="text-left p-3 text-sm font-medium">Hash Result</th>
                          <th className="text-left p-3 text-sm font-medium">Time</th>
                          <th className="text-left p-3 text-sm font-medium">Output Length</th>
                          <th className="text-left p-3 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedResults.map((result) => {
                          const tool = HASH_TOOLS.find((t) => t.id === result.algorithm);
                          const isFastest = fastest?.algorithm === result.algorithm;
                          const isSlowest = slowest?.algorithm === result.algorithm && result.executionTime > 10; // Only highlight if > 10ms
                          const isError = !!result.error;

                          return (
                            <motion.tr
                              key={result.algorithm}
                              className={`border-b hover:bg-muted/50 transition-colors ${
                                isFastest ? "bg-green-50/50 dark:bg-green-900/10" : ""
                              } ${isSlowest ? "bg-red-50/50 dark:bg-red-900/10" : ""}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {isFastest && (
                                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  )}
                                  {isSlowest && (
                                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  )}
                                  <span className="font-medium text-sm">
                                    {tool?.name || result.algorithm}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="secondary" className="text-xs">
                                  {result.category}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {result.isComputing ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Computing...</span>
                                  </div>
                                ) : isError ? (
                                  <span className="text-sm text-red-600 dark:text-red-400">
                                    {result.error}
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-2 max-w-md">
                                    <code className="text-xs font-mono break-all flex-1">
                                      {result.hash.length > 60
                                        ? `${result.hash.substring(0, 60)}...`
                                        : result.hash}
                                    </code>
                                  </div>
                                )}
                              </td>
                              <td className="p-3">
                                {result.isComputing ? (
                                  <span className="text-sm text-muted-foreground">-</span>
                                ) : result.executionTime > 0 ? (
                                  <span className="text-sm font-mono">
                                    {formatTime(result.executionTime)}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-muted-foreground">
                                  {result.outputLength} bytes
                                </span>
                              </td>
                              <td className="p-3">
                                {!result.isComputing && !isError && result.hash && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(result.hash)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                )}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {sortedResults.map((result) => {
                      const tool = HASH_TOOLS.find((t) => t.id === result.algorithm);
                      const isFastest = fastest?.algorithm === result.algorithm;
                      const isSlowest = slowest?.algorithm === result.algorithm && result.executionTime > 10;
                      const isError = !!result.error;

                      return (
                        <motion.div
                          key={result.algorithm}
                          className={`border rounded-lg p-4 space-y-3 ${
                            isFastest ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : ""
                          } ${
                            isSlowest ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800" : ""
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {isFastest && (
                                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                )}
                                {isSlowest && (
                                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                                <span className="font-medium text-sm">
                                  {tool?.name || result.algorithm}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {result.category}
                              </Badge>
                            </div>
                            {!result.isComputing && !isError && result.hash && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.hash)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {result.isComputing ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Computing...</span>
                            </div>
                          ) : isError ? (
                            <span className="text-sm text-red-600 dark:text-red-400">
                              {result.error}
                            </span>
                          ) : (
                            <>
                              <div>
                                <Label className="text-xs text-muted-foreground">Hash Result</Label>
                                <code className="block text-xs font-mono break-all mt-1 p-2 bg-muted rounded">
                                  {result.hash}
                                </code>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div>
                                  <span className="text-muted-foreground">Time: </span>
                                  <span className="font-mono">
                                    {result.executionTime > 0 ? formatTime(result.executionTime) : "-"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Length: </span>
                                  <span>{result.outputLength} bytes</span>
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Summary Stats */}
                  {fastest && slowest && sortedResults.length > 1 && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h3 className="text-sm font-medium mb-3">Summary</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Algorithms: </span>
                          <span className="font-medium">{sortedResults.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Iterations: </span>
                          <span className="font-medium">{iterations.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fastest: </span>
                          <span className="font-medium">
                            {HASH_TOOLS.find((t) => t.id === fastest.algorithm)?.name} (
                            {formatTime(fastest.executionTime)})
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Slowest: </span>
                          <span className="font-medium">
                            {HASH_TOOLS.find((t) => t.id === slowest.algorithm)?.name} (
                            {formatTime(slowest.executionTime)})
                          </span>
                        </div>
                      </div>
                      {iterations > 1 && (
                        <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Avg time per iteration (fastest): </span>
                              <span className="font-medium">
                                {formatTime(fastest.executionTime / iterations)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg time per iteration (slowest): </span>
                              <span className="font-medium">
                                {formatTime(slowest.executionTime / iterations)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Hash className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Algorithms Selected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select one or more hash algorithms above to start comparing.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
