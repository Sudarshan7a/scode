export interface OAuthProvider {
  id: string;
  name: string;
  logo: string;
  callbackUrl?: string;
}

export const oauthProviders: OAuthProvider[] = [
  {
    id: "google",
    name: "Google",
    logo: "/svg/google.svg",
    callbackUrl: "/api/auth/callback/google",
  },
  {
    id: "github",
    name: "GitHub",
    logo: "/svg/github.svg",
    callbackUrl: "/api/auth/callback/github",
  },
];
