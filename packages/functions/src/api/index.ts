import { Resource } from "sst";
import { Handler } from "aws-lambda";

import { logger } from "hono/logger";
import { handle, streamHandle } from "hono/aws-lambda";
import { Hono } from "hono";

//export const handler: Handler = async (_event) => {
//  const testString = "Hello world";
//  return {
//    statusCode: 200,
//    body: `${testString} Linked to ${Resource.MyBucket.name}.`,
//  };
//};

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hono world");
});

// const routes = app.route("/user", UserApi.route).onError((error, c) => {
//   console.error(error);
// });

export const handler = handle(app);
