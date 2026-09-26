import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-ignore",
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  prettierConfig,
  {
    rules: {
      // Kept as warnings, same as the previous Vue CLI setup.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  }
);
