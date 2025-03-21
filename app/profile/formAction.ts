"use server";
import { prisma } from "@/lib/prisma";
import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";

const UserNameUpdateSchema = z.string().min(3).max(20);

export const UserNameUpdate = authenticatedAction
  .schema(UserNameUpdateSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.user.update({
      where: {
        id: ctx.userId,
      },
      data: {
        name: parsedInput,
      },
    });

    return "Name updated";
  });
