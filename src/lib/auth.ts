
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const databaseUrl = process.env.DATABASE_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!databaseUrl || databaseUrl ==="DATABASE_URL") {
  throw new Error(
    "DATABASE_URL সেট করুন। .env ফাইলে MongoDB connection string দিন।",
  );
}

if (
  !authSecret ||
  authSecret === "replace-with-a-long-random-secret"
) {
  throw new Error(
    "BETTER_AUTH_SECRET সেট করুন। .env ফাইলে secure secret দিন।",
  );
}

const client = new MongoClient(databaseUrl);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET!,
    },

    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID!,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET!,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
});
