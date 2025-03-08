import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NodeMailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";

export const {
  auth: baseAuth,
  handlers,
  signIn,
} = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    NodeMailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.image = user.image;
      return session;
    },
    async signIn({ user }) {
      if (!user.name) {
        user.name = user.email?.includes("@")
          ? user.email.split("@")[0]
          : `User_${Math.floor(Math.random() * 10000)}`;
      }
      if (!user.image) {
        user.image = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`;
      }
      return true;
    },
  },
});
