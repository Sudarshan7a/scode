import type { NextResponse } from "next/server";

export type SignupSuccess = {
  ok: true;
  message: string;
  redirect: string;
  user: { id: string; name: string };
};

export type SignupFailure = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string | undefined>;
};

export type SignupResponse = SignupSuccess | SignupFailure;

export type RespondFn = (json: SignupResponse, status?: number) => NextResponse;
