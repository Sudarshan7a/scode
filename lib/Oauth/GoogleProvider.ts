"use server";
import { signIn } from "../../auth";

export default async function googleAuth() {
  await signIn("google");
}