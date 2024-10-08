import { Resource } from "sst";
import { Handler } from "aws-lambda";

import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { handle, streamHandle } from "hono/aws-lambda";

//export const handler: Handler = async (_event) => {
//  const testString = "Hello world";
//  return {
//    statusCode: 200,
//    body: `${testString} Linked to ${Resource.MyBucket.name}.`,
//  };
//};

const app = new OpenAPIHono();

const routes = app.route("/user", UserApi.route).onError((error, c) => {
  console.error(error);
});

export type Routes = typeof routes;
export const handler = handle(app);
