import { db } from "../drizzle";
import { z } from "zod";
import { createID } from "../util/id";
import { userTable } from "./user.sql";

export module User {
  export const Info = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  });

  export type UserInfo = z.infer<typeof Info>;

  export function create(userInfo: UserInfo) {
    const newID = createID("user");

    db.insert(userTable).values({
      id: newID,
      ...userInfo,
    });
  }
}
