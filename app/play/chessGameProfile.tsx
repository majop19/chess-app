import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChessGameProvider } from "@/context/chessGameContext";
import { UserGameProfile } from "./UserGameProfile";
import { ChessGame } from "./chessGame";

export type UsersInfoType = {
  id: string;
  name: string | null;
  image: string | null;
  imageCloudinary: {
    url: string;
  } | null;
};

export const ChessGameProfile = async () => {
  const session = await getRequiredAuthSession();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      imageCloudinary: {
        select: {
          url: true,
        },
      },
    },
  });

  return (
    <ChessGameProvider initialOrientation="white">
      <div className="bg-background">
        <div className="grid grid-row-3 gap-4">
          <UserGameProfile
            users={{ whiteUser: users[0], blackUser: users[1] }}
            position="top"
          />
          <ChessGame />
          <UserGameProfile
            users={{ whiteUser: users[0], blackUser: users[1] }}
            position="bottom"
          />
        </div>
      </div>
    </ChessGameProvider>
  );
};
