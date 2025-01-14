import { configs } from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import baseConfig from "../../eslint.config.mjs";

export default tseslint.config(...baseConfig, configs.vite);
