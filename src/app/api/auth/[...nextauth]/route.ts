import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { rateLimit } from "@/app/api/rate-limit";
import { NextRequest, NextResponse } from "next/server";

if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
} else if (process.env.URL) {
  // Netlify production URL
  process.env.NEXTAUTH_URL = process.env.URL;
} else if (process.env.DEPLOY_PRIME_URL) {
  // Netlify deploy preview URL
  process.env.NEXTAUTH_URL = process.env.DEPLOY_PRIME_URL;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      style: {
        logo: '/google.svg',
        logoDark: '/google.svg',
        bgDark: '#fff',
        bg: '#fff',
        text: '#000',
        textDark: '#000',
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (dbUser) {
          token.role = dbUser.role;
          token.sellerName = dbUser.sellerName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).sellerName = token.sellerName as string | null;
      }
      return session;
    },
  },

};

const handler = NextAuth(authOptions);

// Rate-limited wrapper — max 20 auth requests per IP per minute
async function rateLimitedHandler(req: NextRequest, ctx: any) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining, resetAt } = rateLimit(`auth:${ip}`, 20, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many authentication requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const response = await (req.method === "GET"
    ? handler(req as any, ctx)
    : handler(req as any, ctx));

  if (response instanceof Response) {
    response.headers.set("X-RateLimit-Limit", "20");
    response.headers.set("X-RateLimit-Remaining", String(remaining));
  }

  return response;
}

export { rateLimitedHandler as GET, rateLimitedHandler as POST };
