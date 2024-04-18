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
    path: "dist/canary.js",
    name: "required-react-context/canary",
  },
  {
    path: "dist/canary.cjs",
    name: "required-react-context/canary (CJS)",
  },
  {
    path: "dist/index.js",
    import: "{ createRequiredContext }",
    name: "import { createRequiredContext } from 'required-react-context'",
  },
  {
    path: "dist/canary.cjs",
    import: "{ use }",
    name: "import { use } from 'required-react-context/canary'",
  },
] satisfies SizeLimitConfig;
