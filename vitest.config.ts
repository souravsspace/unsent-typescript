import { defineProject, mergeConfig } from "vitest/config";
import { sharedConfig } from "@unsent/vitest-config";

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      environment: "node",
    },
  }),
);
