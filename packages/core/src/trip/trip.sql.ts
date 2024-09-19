import { mysqlTable, text } from "drizzle-orm/mysql-core";
import {
  ulid,
  id,
  timestamps,
  timestamp,
  dollar,
  address,
} from "../drizzle/types";
import { userTable } from "../user/user.sql";
import { relations } from "drizzle-orm";

export const tripTable = mysqlTable("trip", {
  ...id,
  ...timestamps,
  name: text("name"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  destinationAddress: address("destination_address"),
  budget: dollar("budget"),
  ownerId: ulid("owner_id"),
});

export const tripRelations = relations(tripTable, ({ one }) => ({
  userTable: one(userTable, {
    fields: [tripTable.ownerId],
    references: [userTable.id],
  }),
}));
