"use client";

import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useChessGameProvider } from "@/context/chessGameContext";
import { useTimersStore } from "@/lib/store/timers-store";

export const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const { orientation, setCapturedPieces } = useChessGameProvider();

  const isRunning = useTimersStore((s) => s.isRunning);

  const startGame = useTimersStore((s) => s.startGame);

  const switchPlayerTurn = useTimersStore((s) => s.switchPlayerTurn);

  useEffect(() => {
    // Calculer les pièces capturées
    if (!isRunning.white && !isRunning.black) {
      startGame(100000, 1000);
    }

    const captured = { w: [] as string[], b: [] as string[] };

    // Compter les pièces sur le plateau
    const fen = game.fen();
    const pieces = {
      p: 8,
      n: 2,
      b: 2,
      r: 2,
      q: 1,
      k: 1, // Pièces noires
      P: 8,
      N: 2,
      B: 2,
      R: 2,
      Q: 1,
      K: 1, // Pièces blanches
    };

    // Réduire le compteur pour chaque pièce sur le plateau
    for (const char of fen.split(" ")[0]) {
      if (pieces[char as keyof typeof pieces] !== undefined) {
        pieces[char as keyof typeof pieces]--;
      }
    }

    // Les pièces avec un compteur > 0 sont capturées
    for (const [piece, count] of Object.entries(pieces)) {
      // Les pièces en minuscules sont noires, en majuscules sont blanches
      const color = piece === piece.toLowerCase() ? "b" : "w";
      const pieceType = piece.toLowerCase();

      // Ajouter les pièces capturées à la liste
      for (let i = 0; i < count; i++) {
        captured[color === "w" ? "b" : "w"].push(pieceType);
      }
    }

    setCapturedPieces(captured);
  }, [game]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (move === null) return false;

      // Créer une nouvelle instance pour déclencher le re-rendu
      setGame(new Chess(game.fen()));
      switchPlayerTurn();
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <div className="md:col-span-2 border-6 rounded-md">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        customDarkSquareStyle={{ backgroundColor: "var(--background)" }}
        customLightSquareStyle={{ backgroundColor: "var(--card)" }}
        boardWidth={750}
      />
    </div>
  );
};
