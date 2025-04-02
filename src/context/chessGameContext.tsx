"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

type OrientationType = "white" | "black";

type CapturedPieces = {
  w: string[];
  b: string[];
};

type ChessGameContextType = {
  orientation: OrientationType;
  capturedPieces: CapturedPieces;
  setOrientation: (currentOrientation: OrientationType) => void;
  setCapturedPieces: (newCapturedPieces: CapturedPieces) => void;
};

const ChessGameContext = createContext<ChessGameContextType | null>(null);

export const ChessGameProvider = ({
  initialOrientation,
  children,
}: { initialOrientation: OrientationType } & PropsWithChildren) => {
  const [orientation, setOrientation] = useState<OrientationType>(
    () => initialOrientation
  );
  const [capturedPieces, setCapturedPieces] = useState({
    w: [] as string[],
    b: [] as string[],
  });

  const value = {
    orientation,
    capturedPieces,
    setOrientation,
    setCapturedPieces,
  };

  return (
    <ChessGameContext.Provider value={value}>
      {children}
    </ChessGameContext.Provider>
  );
};

export const useChessGameProvider = () => {
  const context = useContext(ChessGameContext);

  if (!context) {
    throw new Error("ChessGameContext must be used within a ThemeProvider");
  }

  return context;
};
