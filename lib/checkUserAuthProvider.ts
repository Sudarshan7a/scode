"use server";

import { auth } from "../auth";

export async function checkUserAuthProvider(userId?: string) {
  const session = await auth();
  console.log(
    "checkUserAuthProvider - session user ID:",
    session,
    "input userId:",
    userId
  );
  if (session) {
    return "OAuth";
  } else {
    return "custom";
  }
}