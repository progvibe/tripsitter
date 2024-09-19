/// <reference path="./.sst/platform/config.d.ts" />
import { readdirSync } from "fs";
export default $config({
  app(input) {
    return {
      name: "tripsitter",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { planetscale: "0.0.7" },
    };
  },
  async run() {
    await import("./infra/storage");
    await import("./infra/api");
    await import("./infra/database");
  },
});
