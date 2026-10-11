// The filename must be exactly vitest.config.ts. Vitest only auto-loads its
// known config names, and an earlier typo (vistest.config.ts) meant none of
// the settings below, thresholds included, were ever applied.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      // text: console table; json-summary: totals for a coverage badge;
      // json: per-file details for tooling.
      reporter: ["text", "json-summary", "json"],
      // Still write the report when tests fail, to see what was not covered.
      reportOnFailure: true,
      // Measure every source file, including ones no test imports. Otherwise
      // an untested file is invisible and coverage looks better than it is.
      include: ["src/**/*.ts"],
      // Tests live in tests/, but exclude co-located test files in case
      // any are added to src/ later.
      exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"],
      // The run fails if any metric drops below its threshold.
      // 90 is the bar from the lab spec (Lab 00-A, "Done When").
      thresholds: {
        lines: 90,
        statements: 90,
        branches: 85,
        functions: 90,
      },
    },
  },
});
