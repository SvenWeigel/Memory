import {
  buildCodeThemePairs,
  buildFoodThemePairs,
  codeThemeBackSide,
  foodThemeBackSide,
} from "./cards";
import {
  getCardSize,
  getGridColumnCount,
  getPlayerLabelImage,
  getSelectedCardCount,
  getStoredStartingPlayer,
  getStoredTheme,
  getWinnerData,
  type Player,
} from "./gameHelpers";

let grid = document.querySelector(".game-board__grid") as HTMLDivElement;
const gameContent = document.querySelector<HTMLElement>(".game-content");
const blueScore = document.querySelector<HTMLSpanElement>(
  ".header__score-value--blue",
);
const orangeScore = document.querySelector<HTMLSpanElement>(
  ".header__score-value--orange",
);
const blueScoreIcon = document.querySelector<HTMLImageElement>(
  ".header__score__left img",
);
const orangeScoreIcon = document.querySelector<HTMLImageElement>(
  ".header__score__right img",
);
const currentPlayerName = document.querySelector<HTMLSpanElement>(
  ".header__current-player__name",
);
const currentPlayerIcon = document.querySelector<HTMLImageElement>(
  ".header__current-player__icon",
);
const exitButton = document.querySelector<HTMLButtonElement>(
  ".header__exit .exit-btn",
);
const exitOverlay = document.querySelector<HTMLDivElement>(".exit-overlay");
const closeOverlayButton = document.querySelector<HTMLButtonElement>(
  ".exit-overlay__btn-close",
);
const settingsOverlayButton = document.querySelector<HTMLButtonElement>(
  ".exit-overlay__btn-settings",
);
const gameOverOverlay =
  document.querySelector<HTMLDivElement>(".game-over-overlay");
const gameOverBlueScore = document.querySelector<HTMLSpanElement>(
  ".game-over-overlay__score-value--blue",
);
const gameOverOrangeScore = document.querySelector<HTMLSpanElement>(
  ".game-over-overlay__score-value--orange",
);
const endOverlay = document.querySelector<HTMLDivElement>(".end-overlay");
const endWinnerText = document.querySelector<HTMLHeadingElement>(
  ".end-overlay__winner",
);
const endLoserText = document.querySelector<HTMLParagraphElement>(
  ".end-overlay__loser",
);
const endWinnerPawn =
  document.querySelector<HTMLImageElement>(".end-overlay__pawn");
const endBackButton = document.querySelector<HTMLButtonElement>(
  ".end-overlay__back-btn",
);
let revealedCards: HTMLButtonElement[] = [];
let isComparingCards = false;
let hasEndSequenceStarted = false;
let currentPlayer: Player = getStoredStartingPlayer();
const scores: Record<Player, number> = {
  Blue: 0,
  Orange: 0,
};

function getThemeBuildFunction() {
  const theme = getStoredTheme();
  return theme === "food" ? buildFoodThemePairs : buildCodeThemePairs;
}

function getThemeBackSide() {
  const theme = getStoredTheme();
  return theme === "food" ? foodThemeBackSide : codeThemeBackSide;
}

function applyThemeClass(isFoodTheme: boolean) {
  gameContent?.classList.toggle("theme-food", isFoodTheme);
}

function applyScoreIcons(isFoodTheme: boolean) {
  if (blueScoreIcon) {
    blueScoreIcon.src = isFoodTheme
      ? "/assets/pawn-blue.png"
      : "/assets/label-blue.png";
    blueScoreIcon.alt = isFoodTheme ? "blue pawn" : "blue label";
  }

  if (orangeScoreIcon) {
    orangeScoreIcon.src = isFoodTheme
      ? "/assets/pawn-orange.png"
      : "/assets/label-orange.png";
    orangeScoreIcon.alt = isFoodTheme ? "orange pawn" : "orange label";
  }
}

function applyEndBackButtonText(isFoodTheme: boolean) {
  if (!endBackButton) return;
  endBackButton.textContent = isFoodTheme ? "HOME" : "Back to start";
}

function applyThemeStyles() {
  const theme = getStoredTheme();
  const isFoodTheme = theme === "food";

  applyThemeClass(isFoodTheme);
  applyScoreIcons(isFoodTheme);
  applyEndBackButtonText(isFoodTheme);
}

function updateScoreboard() {
  if (blueScore) {
    blueScore.textContent = String(scores.Blue);
  }

  if (orangeScore) {
    orangeScore.textContent = String(scores.Orange);
  }
}

function updateCurrentPlayerDisplay() {
  if (currentPlayerName) {
    currentPlayerName.textContent = currentPlayer;
  }

  if (currentPlayerIcon) {
    currentPlayerIcon.src = getPlayerLabelImage(currentPlayer, getStoredTheme());
    currentPlayerIcon.alt = `${currentPlayer.toLowerCase()}-label`;
  }
}

function awardPointToCurrentPlayer() {
  scores[currentPlayer] += 1;
  updateScoreboard();
}

function switchCurrentPlayer() {
  currentPlayer = currentPlayer === "Blue" ? "Orange" : "Blue";
  updateCurrentPlayerDisplay();
}

function revealCard(card: HTMLButtonElement) {
  card.classList.add("is-revealed");
}

function hideCard(card: HTMLButtonElement) {
  card.classList.remove("is-revealed");
}

function isMatchingPair(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
) {
  return firstCard.dataset.image === secondCard.dataset.image;
}

function lockMatchedPair(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
) {
  firstCard.disabled = true;
  secondCard.disabled = true;
  firstCard.classList.add("is-matched");
  secondCard.classList.add("is-matched");
}

function resetRevealedCards() {
  revealedCards = [];
  isComparingCards = false;
}

function getUnmatchedCardCount() {
  return grid.querySelectorAll<HTMLButtonElement>(".card:not(.is-matched)").length;
}

function isGameFinished() {
  return getUnmatchedCardCount() === 0;
}

function updateGameOverScoreboard() {
  if (gameOverBlueScore) {
    gameOverBlueScore.textContent = String(scores.Blue);
  }

  if (gameOverOrangeScore) {
    gameOverOrangeScore.textContent = String(scores.Orange);
  }
}

function showGameOverOverlay() {
  if (!gameOverOverlay) {
    return;
  }

  updateGameOverScoreboard();
  gameOverOverlay.classList.add("is-visible");
  gameOverOverlay.setAttribute("aria-hidden", "false");
}

function hideGameOverOverlay() {
  if (!gameOverOverlay) {
    return;
  }

  gameOverOverlay.classList.remove("is-visible");
  gameOverOverlay.setAttribute("aria-hidden", "true");
}

function applyEndWinnerText(winnerData: ReturnType<typeof getWinnerData>) {
  if (!endWinnerText) return;

  endWinnerText.textContent = winnerData.winner;
  endWinnerText.classList.remove(
    "end-overlay__winner--blue",
    "end-overlay__winner--orange",
    "end-overlay__winner--draw",
  );
  endWinnerText.classList.add(winnerData.winnerClass);
}

function applyEndWinnerPawn(winnerData: ReturnType<typeof getWinnerData>) {
  if (!endWinnerPawn) return;

  endWinnerPawn.src = winnerData.pawn;
  endWinnerPawn.alt = winnerData.pawnAlt;
}

function setEndOverlayVisible() {
  endOverlay?.classList.add("is-visible");
  endOverlay?.setAttribute("aria-hidden", "false");
}

function showEndOverlay() {
  if (!endOverlay || endOverlay.classList.contains("is-visible")) {
    return;
  }

  const winnerData = getWinnerData(scores);
  applyEndWinnerText(winnerData);
  applyEndWinnerPawn(winnerData);
  setEndOverlayVisible();
}

function checkForGameEnd() {
  if (!isGameFinished() || hasEndSequenceStarted) {
    return;
  }

  hasEndSequenceStarted = true;

  window.setTimeout(() => {
    showGameOverOverlay();

    window.setTimeout(() => {
      hideGameOverOverlay();
      showEndOverlay();
    }, 2200);
  }, 450);
}

function checkRevealedCards() {
  const [firstCard, secondCard] = revealedCards;

  if (!firstCard || !secondCard) {
    resetRevealedCards();
    return;
  }

  if (isMatchingPair(firstCard, secondCard)) {
    awardPointToCurrentPlayer();
    lockMatchedPair(firstCard, secondCard);
    checkForGameEnd();
    resetRevealedCards();
    return;
  }

  window.setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    switchCurrentPlayer();
    resetRevealedCards();
  }, 900);
}

function handleCardClick(card: HTMLButtonElement) {
  if (
    isComparingCards ||
    card.classList.contains("is-revealed") ||
    card.disabled
  ) {
    return;
  }
  revealCard(card);
  revealedCards.push(card);
  if (revealedCards.length < 2) {
    return;
  }
  isComparingCards = true;
  checkRevealedCards();
}

function getRenderGridData() {
  const cardCount = getSelectedCardCount();
  const columnCount = getGridColumnCount(cardCount);
  const cardSize = getCardSize(cardCount);
  const buildFunction = getThemeBuildFunction();
  const backSideImage = getThemeBackSide();
  const cardPairs = buildFunction(cardCount);

  return { columnCount, cardSize, backSideImage, cardPairs };
}

function applyGridStyles(columnCount: number, cardSize: number) {
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${columnCount}, ${cardSize}px)`;
  grid.style.gap = "20px";
}

function createCardFace(
  image: string,
  faceClass: "card__face--back" | "card__face--front",
  alt: string,
) {
  const face = document.createElement("img");
  face.classList.add("card__face", faceClass);
  face.src = image;
  face.alt = alt;
  return face;
}

function createCardButton(cardImage: string, index: number) {
  const card = document.createElement("button");
  card.type = "button";
  card.classList.add("card", `card-${index}`);
  card.setAttribute("aria-label", `Memory card ${index + 1}`);
  card.dataset.image = cardImage;
  card.addEventListener("click", () => handleCardClick(card));
  return card;
}

function createCardElement(cardImage: string, index: number, backSideImage: string) {
  const card = createCardButton(cardImage, index);
  const cardInner = document.createElement("div");
  cardInner.classList.add("card__inner");
  cardInner.appendChild(createCardFace(backSideImage, "card__face--back", "Card back"));
  cardInner.appendChild(createCardFace(cardImage, "card__face--front", "Card front"));
  card.appendChild(cardInner);
  return card;
}

function renderCardElements(cardPairs: string[], backSideImage: string) {
  for (let i = 0; i < cardPairs.length; i++) {
    grid.appendChild(createCardElement(cardPairs[i], i, backSideImage));
  }
}

function renderGrid() {
  if (grid.innerHTML !== "") return;

  const { columnCount, cardSize, backSideImage, cardPairs } = getRenderGridData();
  applyGridStyles(columnCount, cardSize);
  renderCardElements(cardPairs, backSideImage);
}

function openExitOverlay() {
  if (!exitOverlay) {
    return;
  }

  exitOverlay.classList.add("is-visible");
  exitOverlay.setAttribute("aria-hidden", "false");
}

function closeExitOverlay() {
  if (!exitOverlay) {
    return;
  }

  exitOverlay.classList.remove("is-visible");
  exitOverlay.setAttribute("aria-hidden", "true");
}

function setupExitOverlay() {
  exitButton?.addEventListener("click", openExitOverlay);
  closeOverlayButton?.addEventListener("click", closeExitOverlay);
  settingsOverlayButton?.addEventListener("click", () => {
    window.location.href = "./settings.html";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeExitOverlay();
    }
  });
}

function setupEndOverlay() {
  endBackButton?.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}

updateScoreboard();
updateCurrentPlayerDisplay();
applyThemeStyles();
renderGrid();
setupExitOverlay();
setupEndOverlay();