"use server";
import { signIn } from "../../auth";

export default async function githubAuth() {
  await signIn("github");
}