"use client";

// Simple client-side auth state to avoid repeated session checks
let isOAuthUser = false;
let isInitialized = false;

export function setOAuthUser(value: boolean) {
  isOAuthUser = value;
  isInitialized = true;
}

export function getIsOAuthUser(): boolean {
  return isOAuthUser;
}

export function isAuthStateInitialized(): boolean {
  return isInitialized;
}

export function clearAuthState() {
  isOAuthUser = false;
  isInitialized = false;
}