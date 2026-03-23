export type Player = "Blue" | "Orange";
export type Theme = "code" | "food";
export type Scores = Record<Player, number>;

type WinnerData = {
  winner: string;
  pawn: string;
  pawnAlt: string;
  winnerClass: string;
};

export function getStoredStartingPlayer(): Player {
  const storedPlayer = localStorage.getItem("memoryStartingPlayer");
  if (storedPlayer === "Blue" || storedPlayer === "Orange") {
    return storedPlayer;
  }
  return "Blue";
}

export function getStoredTheme(): Theme {
  const storedTheme = localStorage.getItem("memoryTheme");
  if (storedTheme === "food") {
    return "food";
  }
  return "code";
}

export function getPlayerLabelImage(player: Player, theme: Theme) {
  if (theme === "food") {
    if (player === "Orange") {
      return "/assets/pawn-orange.png";
    }
    return "/assets/pawn-blue.png";
  }

  if (player === "Orange") {
    return "/assets/label-orange.png";
  }
  return "/assets/label-blue.png";
}

export function getSelectedCardCount() {
  const storedCardCount = localStorage.getItem("memoryCardCount");
  const parsedCardCount = storedCardCount
    ? Number.parseInt(storedCardCount, 10)
    : 16;

  if (parsedCardCount === 32) {
    return 36;
  }

  if (
    parsedCardCount === 16 ||
    parsedCardCount === 24 ||
    parsedCardCount === 36
  ) {
    return parsedCardCount;
  }
  return 16;
}

export function syncSelectedCardCountStorage() {
  const selectedCardCount = getSelectedCardCount();
  if (localStorage.getItem("memoryCardCount") !== String(selectedCardCount)) {
    localStorage.setItem("memoryCardCount", String(selectedCardCount));
  }
}

export function getGridColumnCount(cardCount: number) {
  if (cardCount === 24) return 6;
  if (cardCount === 36) return 6;
  return 4;
}

export function getCardSize() {
  return 110;
}

export function getWinnerData(scores: Scores): WinnerData {
  if (scores.Blue > scores.Orange) {
    return {
      winner: "Blue Player",
      pawn: "/assets/pawn-blue.png",
      pawnAlt: "blue pawn",
      winnerClass: "end-overlay__winner--blue",
    };
  }

  if (scores.Orange > scores.Blue) {
    return {
      winner: "Orange Player",
      pawn: "/assets/pawn-orange.png",
      pawnAlt: "orange pawn",
      winnerClass: "end-overlay__winner--orange",
    };
  }

  return {
    winner: "Draw",
    pawn: "/assets/pawn-blue.png",
    pawnAlt: "pawn",
    winnerClass: "end-overlay__winner--draw",
  };
}
