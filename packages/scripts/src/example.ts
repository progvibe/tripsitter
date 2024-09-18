import { Resource } from "sst";
import { Example } from "@tripsitter/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
