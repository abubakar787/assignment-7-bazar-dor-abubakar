import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

function createAuth() {
  const databaseUrl = process.env.DATABASE_URL;
  const authSecret = process.env.BETTER_AUTH_SECRET;

  if (!databaseUrl || databaseUrl === "DATABASE_URL") {
    throw new Error(
      "DATABASE_URL is missing or set to a placeholder. Add a valid MongoDB connection string to the environment variables.",
    );
  }

  if (!authSecret || authSecret === "BETTER_AUTH_SECRET") {
    throw new Error(
      "BETTER_AUTH_SECRET is missing or set to a placeholder. Generate a long random secret and add it to the environment variables.",
    );
  }

  const client = new MongoClient(databaseUrl);
  const db = client.db();

  return betterAuth({
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
}

type Auth = ReturnType<typeof createAuth>;

let authInstance: Auth | null = null;

/**
 * Returns the Better Auth instance, creating it on first use.
 *
 * The environment is validated here rather than at module scope so that a
 * missing secret fails at request time instead of breaking `next build`
 * (route modules are imported during page-data collection).
 */
export function getAuth(): Auth {
  authInstance ??= createAuth();
  return authInstance;
}
