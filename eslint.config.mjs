import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
              message: "A feature must not import from another feature.",
            },
            {
              target: "./src/features/feed",
              from: "./src/features",
              except: ["./feed"],
              message: "A feature must not import from another feature.",
            },
            {
              target: "./src/features/tweet",
              from: "./src/features",
              except: ["./tweet"],
              message: "A feature must not import from another feature.",
            },
            {
              target: "./src/features/profile",
              from: "./src/features",
              except: ["./profile"],
              message: "A feature must not import from another feature.",
            },
            {
              target: "./src/features/compose",
              from: "./src/features",
              except: ["./compose"],
              message: "A feature must not import from another feature.",
            },
            {
              target: [
                "./src/components",
                "./src/config",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
              message: "Shared modules must not import from features or app.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
