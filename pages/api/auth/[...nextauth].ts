import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import nodemailer from "nodemailer";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      // Vous pouvez personnaliser la fonction d'envoi des emails si nécessaire
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(provider.server);
        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `Connexion à ${host}`,
          text: `Connectez-vous à ${host}\n${url}\n\n`,
          html: `<p>Connectez-vous à ${host}</p><p><a href="${url}">Cliquez ici pour vous connecter</a></p>`,
        });
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.image = user.image;
      return session;
    },
  },
};

export default NextAuth(authOptions);
