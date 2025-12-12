import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { createUser } from "./app/api/auth/signup/service";
import { connectToMongo } from "@/lib/mongodb"; // Safe to import here!

//how to set userId cookie after OAuth login with NextAuth.js in Next.js 13 app router?
//https://next-auth.js.org/configuration/callbacks#session-callback

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 🎯 Always send to dashboard after login
      return `${baseUrl}/dashboard?login-signup=true`;
    },
    async signIn({ user, account }) {
      if (
        (account?.provider === "google" || account?.provider === "github") &&
        user.email
      ) {
        // Ensure user exists in your DB for OAuth providers
        await createUser(user.email, "", user.name || "", false, "oauth");
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // 1. If this is the initial sign-in...
      if (account && user) {
        // 2. Connect to DB and find the user by email
        const { usersCollection } = await connectToMongo();
        const dbUser = await usersCollection.findOne({ email: user.email });

        // 3. 🎯 OVERWRITE the token's 'sub' with the MongoDB _id!
        if (dbUser) {
          token.sub = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      // 🎯 This is critical!
      // This makes the userId available whenever you call auth()
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
});