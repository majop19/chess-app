"use client";
import { create } from "zustand";

type Increment = 0 | 1000 | 2000 | 10000;

type TimersState = {
  white: number; // en milliseconds
  black: number;
  isRunning: { white: boolean; black: boolean };
  increment: Increment;
};

type TimersAction = {
  startGame: (timeStamp: number, increment?: Increment) => void;
  decrementTimer: (player: "white" | "black") => void;
  switchPlayerTurn: () => void;
  endGame: () => void;
};

export type TimersStore = TimersState & TimersAction;

export const useTimersStore = create<TimersStore>()((set) => ({
  white: 0,
  black: 0,
  isRunning: { white: false, black: false },
  increment: 0,
  startGame: (timeStamp: number, increment?: Increment) =>
    set(() => ({
      white: timeStamp,
      black: timeStamp,
      isRunning: { white: true, black: false },
      increment: increment ?? 0,
    })),
  decrementTimer: (player: "white" | "black") =>
    set((state) => ({ ...state, [player]: state[player] - 100 })),
  switchPlayerTurn: () =>
    set((state) => {
      const playerTurn = state.isRunning.white ? "white" : "black";

      return {
        ...state,
        isRunning: {
          white: state.isRunning.black,
          black: state.isRunning.white,
        },
        [playerTurn]: state[playerTurn] + state.increment,
      };
    }),
  endGame: () =>
    set((state) => ({
      ...state,
      isRunning: { white: false, black: false },
    })),
}));
