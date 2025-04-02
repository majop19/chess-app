"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChessGameProvider } from "@/context/chessGameContext";
import { UsersInfoType } from "./chessGameProfile";
import { useEffect } from "react";
import { useTimersStore } from "@/lib/store/timers-store";
import { Digit } from "@/components/blocks/Components/Counter/Counter";
import { AlarmClock } from "lucide-react";

// Fonction pour afficher une pièce capturée
function renderPiece(piece: string) {
  const pieces = {
    p: "♟",
    n: "♞",
    b: "♝",
    r: "♜",
    q: "♛",
    k: "♚", // Symboles Unicode des pièces
  };
  return pieces[piece as keyof typeof pieces] || "";
}

export const UserGameProfile = ({
  users,
  position,
}: {
  users: { whiteUser: UsersInfoType; blackUser: UsersInfoType };
  position: "top" | "bottom";
}) => {
  const { orientation, capturedPieces } = useChessGameProvider();

  const isTop = position === "top";

  const user = isTop
    ? orientation === "white"
      ? users.blackUser
      : users.whiteUser
    : orientation === "white"
    ? users.whiteUser
    : users.blackUser;

  const capturedPiecesColor = isTop
    ? orientation === "white"
      ? capturedPieces.b
      : capturedPieces.w
    : orientation === "white"
    ? capturedPieces.w
    : capturedPieces.b;

  const timerPlayer = isTop
    ? orientation === "white"
      ? "black"
      : "white"
    : orientation;

  return (
    <div className="flex flex-items gap-2 p-3 w-[720px] items-center">
      <Avatar className="size-14">
        <AvatarImage
          src={user.imageCloudinary?.url ?? user.image ?? undefined}
        />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <p className="font-medium text-xl">{user.name}</p>
      <div>
        {capturedPiecesColor.map((piece, i) => (
          <span key={i}>{renderPiece(piece)}</span>
        ))}
      </div>
      <GameTimer player={timerPlayer} />
    </div>
  );
};

export const GameTimer = ({ player }: { player: "white" | "black" }) => {
  const PlayerTimer = useTimersStore((s) => s[player]);

  const decrementTimer = useTimersStore((s) => s.decrementTimer);

  const isRunning = useTimersStore((s) => s.isRunning);

  const endGame = useTimersStore((s) => s.endGame);

  function formatTime(ms: number) {
    // Calculer les minutes, secondes et dixièmes de seconde
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((totalSeconds * 10) % 10);

    return { minutes: minutes, seconds: seconds, tenths: tenths };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning[player]) {
        decrementTimer(player);
        if (PlayerTimer === 100) {
          endGame();
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [PlayerTimer, isRunning.white, isRunning.black]);

  const time = formatTime(PlayerTimer);

  return (
    <div className="w-45 h-12 bg-border flex items-center text-4xl font-semibold text-background justify-end pr-3 relative ml-auto">
      {isRunning[player] ? (
        <AlarmClock size={45} className="absolute left-0 p-2" />
      ) : null}
      {isRunning.white || isRunning.black ? (
        <DigitDisplayAnimation
          value={time.minutes}
          places={time.minutes >= 10 ? [10, 1] : [1]}
          height={44}
        />
      ) : (
        <div>0</div>
      )}

      <span className="pb-1.5 w-[0.5ch]">:</span>
      {isRunning.white || isRunning.black ? (
        <DigitDisplayAnimation
          value={time.seconds}
          places={[10, 1]}
          height={44}
        />
      ) : (
        <div>00</div>
      )}
      {time.minutes * 60 + time.seconds < 20 &&
      time.minutes + time.seconds + time.tenths > 0 ? (
        <>
          <span className="w-[0.5ch]">.</span>
          <span className="w-[1ch]">{time.tenths}</span>
        </>
      ) : null}
    </div>
  );
};

const DigitDisplayAnimation = ({
  value,
  places,
  height,
}: {
  value: number;
  places: number[];
  height: number;
}) => {
  return (
    <div className="flex overflow-hidden">
      {places.map((place) => (
        <Digit key={place} place={place} value={value} height={height} />
      ))}
    </div>
  );
};
