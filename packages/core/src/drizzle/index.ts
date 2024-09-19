import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";
import { Resource } from "sst";
export * from "drizzle-orm";

const client = new Client({
  host: Resource.Database.host,
  username: Resource.Database.username,
  password: Resource.Database.password,
});

export const db = drizzle(client, {
  logger: {
    logQuery(query, params) {
      console.log(query);
      console.log(params);
    },
  },
});
