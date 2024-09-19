import { mysqlTable, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

import { id, timestamps } from "../drizzle/types";
import { tripTable } from "../trip/trip.sql";

export const userTable = mysqlTable("user", {
  ...id,
  ...timestamps,
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
});
