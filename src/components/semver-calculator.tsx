"use client";

import { useState, useMemo, useCallback } from "react";
import semver from "semver";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

const PRESET_RANGES = [
  { label: "^1.2.3", description: "Caret — allows minor + patch" },
  { label: "~1.2.3", description: "Tilde — allows patch only" },
  { label: ">=1.0.0 <2.0.0", description: "Compound — explicit bounds" },
  { label: "1.x", description: "X-range — any 1.x version" },
  { label: "1.2.0 - 2.0.0", description: "Hyphen — inclusive range" },
  { label: "^1.0.0 || ^2.0.0", description: "OR — dual major support" },
  { label: "~0.2.3", description: "Tilde on 0.x — patch only" },
  { label: "*", description: "Wildcard — any version" },
];

// Generate test versions: 0.0.1, 0.1.0, 0.2.0 … 5.0.0
function generateTestVersions(): string[] {
  const versions: string[] = [];

  // 0.0.x (1–5)
  for (let p = 1; p <= 5; p++) versions.push(`0.0.${p}`);

  // 0.minor.0 (1–5) + 0.minor.patch (1–3)
  for (let m = 1; m <= 5; m++) {
    versions.push(`0.${m}.0`);
    for (let p = 1; p <= 3; p++) versions.push(`0.${m}.${p}`);
  }

  // major.minor.patch (major 1–5)
  for (let major = 1; major <= 5; major++) {
    for (let minor = 0; minor <= 4; minor++) {
      versions.push(`${major}.${minor}.0`);
      for (let patch = 1; patch <= 3; patch++) {
        versions.push(`${major}.${minor}.${patch}`);
      }
    }
  }

  return versions.sort((a, b) => semver.compare(a, b));
}

const ALL_VERSIONS = generateTestVersions();

// --------------------------------------------------------------------------
// Range explanation helper
// --------------------------------------------------------------------------

function explainRange(range: string): string {
  const trimmed = range.trim();
  if (!trimmed) return "";

  // OR combinator
  if (trimmed.includes("||")) {
    const parts = trimmed.split("||").map((p) => p.trim());
    return `Matches versions that satisfy ${parts.map((p) => `"${p}"`).join(" OR ")}.`;
  }

  // Hyphen range
  const hyphenMatch = trimmed.match(
    /^(\d[\d.x*]+)\s*-\s*(\d[\d.x*]+)$/
  );
  if (hyphenMatch) {
    return `Inclusive range: ≥ ${hyphenMatch[1]} and ≤ ${hyphenMatch[2]}.`;
  }

  // Caret
  if (trimmed.startsWith("^")) {
    const ver = trimmed.slice(1);
    const parsed = semver.coerce(ver);
    if (parsed) {
      if (parsed.major > 0) {
        return `Caret — allows any version ≥ ${ver} and < ${parsed.major + 1}.0.0. Minor and patch upgrades are allowed; major version is locked.`;
      } else if (parsed.minor > 0) {
        return `Caret on 0.x — allows any version ≥ ${ver} and < 0.${parsed.minor + 1}.0. Only patch upgrades are allowed.`;
      } else {
        return `Caret on 0.0.x — allows only exact version ${ver}. Breaking changes are assumed at any digit.`;
      }
    }
  }

  // Tilde
  if (trimmed.startsWith("~")) {
    const ver = trimmed.slice(1);
    const parts = ver.split(".");
    if (parts.length >= 2) {
      return `Tilde — allows any version ≥ ${ver} and < ${parts[0]}.${parseInt(parts[1]) + 1}.0. Only patch upgrades are allowed.`;
    } else {
      return `Tilde — allows any version in the ${ver}.x.x range.`;
    }
  }

  // X-range
  if (/[xX*]/.test(trimmed)) {
    if (trimmed === "*" || trimmed === "x" || trimmed === "X") {
      return "Wildcard — matches any version (≥ 0.0.0).";
    }
    const parts = trimmed.split(".");
    if (parts.length === 1) {
      return `X-range — matches any version in the ${parts[0]}.x.x range.`;
    }
    if (parts.length === 2) {
      return `X-range — matches any version in the ${parts[0]}.${parts[1]}.x range, i.e., ≥ ${parts[0]}.${/[xX*]/.test(parts[1]) ? "0" : parts[1]}.0 and < ${parseInt(parts[0]) + 1}.0.0.`;
    }
  }

  // Comparators
  if (trimmed.startsWith(">=") || trimmed.startsWith(">") ||
      trimmed.startsWith("<=") || trimmed.startsWith("<") ||
      trimmed.startsWith("=")) {
    // Multiple comparators joined by space
    if (/\s+/.test(trimmed)) {
      return `Compound range — versions must satisfy all conditions: ${trimmed}.`;
    }
    return `Comparator — matches versions that satisfy ${trimmed}.`;
  }

  // Plain version (exact)
  if (semver.valid(trimmed)) {
    return `Exact version — matches only ${trimmed}.`;
  }

  return "Enter a valid semver range to see an explanation.";
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

export function SemverCalculator() {
  const [rangeInput, setRangeInput] = useState("^1.2.3");
  const [versionInput, setVersionInput] = useState("");
  const [versionTestResult, setVersionTestResult] = useState<boolean | null>(
    null
  );

  const rangeValid = useMemo(() => {
    const cleaned = rangeInput.trim();
    if (!cleaned) return false;
    return semver.validRange(cleaned) !== null;
  }, [rangeInput]);

  const matchingVersions = useMemo(() => {
    if (!rangeValid) return new Set<string>();
    const cleaned = rangeInput.trim();
    return new Set(ALL_VERSIONS.filter((v) => semver.satisfies(v, cleaned)));
  }, [rangeInput, rangeValid]);

  const minVersion = useMemo(() => {
    if (!rangeValid || matchingVersions.size === 0) return null;
    return semver.minSatisfying(ALL_VERSIONS, rangeInput.trim());
  }, [rangeInput, rangeValid, matchingVersions]);

  const maxVersion = useMemo(() => {
    if (!rangeValid || matchingVersions.size === 0) return null;
    return semver.maxSatisfying(ALL_VERSIONS, rangeInput.trim());
  }, [rangeInput, rangeValid, matchingVersions]);

  const explanation = useMemo(() => {
    if (!rangeValid) return "";
    return explainRange(rangeInput.trim());
  }, [rangeInput, rangeValid]);

  const handleRangeChange = useCallback(
    (value: string) => {
      setRangeInput(value);
      setVersionTestResult(null);
    },
    []
  );

  const handlePreset = useCallback(
    (preset: string) => {
      setRangeInput(preset);
      setVersionTestResult(null);
      ToolEvents.toolUsed("preset-range");
    },
    []
  );

  const handleTestVersion = useCallback(() => {
    const v = versionInput.trim();
    if (!v) {
      toast.error("Enter a version to test.");
      return;
    }
    if (!semver.valid(v)) {
      toast.error(`"${v}" is not a valid semver version.`);
      return;
    }
    if (!rangeValid) {
      toast.error("Enter a valid semver range first.");
      return;
    }
    const result = semver.satisfies(v, rangeInput.trim());
    setVersionTestResult(result);
    ToolEvents.toolUsed("version-test");
  }, [versionInput, rangeInput, rangeValid]);

  // Group versions by major.minor for the grid
  const versionGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const v of ALL_VERSIONS) {
      const parsed = semver.parse(v)!;
      const key = `${parsed.major}.${parsed.minor}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    }
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      {/* Range Input */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="range-input">
            Semver Range
          </label>
          <div className="flex gap-2">
            <Input
              id="range-input"
              value={rangeInput}
              onChange={(e) => handleRangeChange(e.target.value)}
              placeholder="e.g. ^1.2.3, ~2.0.0, >=1.0.0 <2.0.0"
              className={`font-mono text-base ${
                rangeInput && !rangeValid
                  ? "border-red-500 focus-visible:ring-red-500"
                  : rangeValid
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
              }`}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          {rangeInput && !rangeValid && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Invalid semver range
            </p>
          )}
          {rangeValid && explanation && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {explanation}
            </p>
          )}
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Preset examples
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_RANGES.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset.label)}
                title={preset.description}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono border transition-colors cursor-pointer ${
                  rangeInput === preset.label
                    ? "bg-brand/10 border-brand/50 text-brand"
                    : "bg-muted/50 border-border hover:border-brand/40 hover:bg-brand/5 text-foreground"
                }`}
              >
                {preset.label}
                <ChevronRight className="h-3 w-3 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <AnimatePresence>
        {rangeValid && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 font-mono">
              {matchingVersions.size} match{matchingVersions.size !== 1 ? "es" : ""}
            </Badge>
            {minVersion && (
              <Badge variant="outline" className="font-mono text-xs">
                min: {minVersion}
              </Badge>
            )}
            {maxVersion && (
              <Badge variant="outline" className="font-mono text-xs">
                max: {maxVersion}
              </Badge>
            )}
            {matchingVersions.size === 0 && (
              <span className="text-sm text-muted-foreground">
                No versions in the test set satisfy this range.
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version Grid */}
      {rangeValid && (
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-semibold">Version Grid</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/40" />
                Matches
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-muted border border-border" />
                No match
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {Object.entries(versionGroups).map(([group, versions]) => {
              const groupHasMatch = versions.some((v) =>
                matchingVersions.has(v)
              );
              return (
                <div key={group} className="space-y-1">
                  <p
                    className={`text-xs font-mono font-medium ${
                      groupHasMatch
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {group}.x
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {versions.map((v) => {
                      const matches = matchingVersions.has(v);
                      const isMin = v === minVersion;
                      const isMax = v === maxVersion;
                      return (
                        <span
                          key={v}
                          title={
                            matches
                              ? `${v} — satisfies range`
                              : `${v} — does not satisfy range`
                          }
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border transition-all ${
                            matches
                              ? isMin || isMax
                                ? "bg-brand/20 border-brand/60 text-brand font-semibold ring-1 ring-brand/30"
                                : "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300"
                              : "bg-muted/40 border-border/40 text-muted-foreground/40"
                          }`}
                        >
                          {v}
                          {isMin && (
                            <span className="ml-1 text-[10px] opacity-70">
                              min
                            </span>
                          )}
                          {isMax && v !== minVersion && (
                            <span className="ml-1 text-[10px] opacity-70">
                              max
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Version Tester */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold">Version Tester</h2>
        <p className="text-xs text-muted-foreground">
          Enter a specific version to check if it satisfies the range above.
        </p>
        <div className="flex gap-2">
          <Input
            value={versionInput}
            onChange={(e) => {
              setVersionInput(e.target.value);
              setVersionTestResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTestVersion();
            }}
            placeholder="e.g. 1.4.2"
            className="font-mono"
            spellCheck={false}
            autoComplete="off"
          />
          <Button
            onClick={handleTestVersion}
            className="bg-gradient-to-r from-brand to-brand-accent text-white shrink-0"
          >
            Test
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {versionTestResult !== null && (
            <motion.div
              key={String(versionTestResult)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                versionTestResult
                  ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300"
                  : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
              }`}
            >
              {versionTestResult ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0" />
              )}
              <div>
                <p className="font-semibold font-mono text-sm">
                  {versionInput.trim()}
                </p>
                <p className="text-xs opacity-80">
                  {versionTestResult
                    ? `satisfies ${rangeInput}`
                    : `does NOT satisfy ${rangeInput}`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
