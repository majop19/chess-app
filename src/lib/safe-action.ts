import { createSafeActionClient } from "next-safe-action";
import { getAuthSession } from "./auth";

export class ServerError extends Error {}

export const action = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof ServerError) {
      return {
        serverError: error.message,
      };
    }

    return {
      serverError: "An unexpected error occurred",
    };
  },
});

export const authenticatedAction = action.use(async ({ next }) => {
  const session = await getAuthSession();

  const user = session?.user;
  const userId = user?.id;

  if (!session) {
    throw new ServerError("You must be logged in to perform this action");
  }

  return next({
    ctx: {
      userId: userId,
      user,
    },
  });
});
