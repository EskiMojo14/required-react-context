import type { SizeLimitConfig } from "size-limit";

export default [
  {
    path: "dist/index.js",
    name: "required-react-context",
  },
  {
    path: "dist/index.cjs",
    name: "required-react-context (CJS)",
  },
  {
    path: "dist/index.js",
    import: "{ createRequiredContext }",
    name: "import { createRequiredContext } from 'required-react-context'",
  },
] satisfies SizeLimitConfig;
