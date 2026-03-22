import { buildCodeThemePairs, buildFoodThemePairs, codeThemeBackSide, foodThemeBackSide } from "./cards";

type Player = "Blue" | "Orange";

let grid = document.querySelector(".game-board__grid") as HTMLDivElement;
const blueScore = document.querySelector<HTMLSpanElement>(".header__score-value--blue");
const orangeScore = document.querySelector<HTMLSpanElement>(".header__score-value--orange");
const currentPlayerName = document.querySelector<HTMLSpanElement>(".header__current-player__name");
const currentPlayerIcon = document.querySelector<HTMLImageElement>(".header__current-player__icon");
const exitButton = document.querySelector<HTMLButtonElement>(".header__exit .exit-btn");
const exitOverlay = document.querySelector<HTMLDivElement>(".exit-overlay");
const closeOverlayButton = document.querySelector<HTMLButtonElement>(".exit-overlay__btn-close");
const settingsOverlayButton = document.querySelector<HTMLButtonElement>(".exit-overlay__btn-settings");
const gameOverOverlay = document.querySelector<HTMLDivElement>(".game-over-overlay");
const gameOverBlueScore = document.querySelector<HTMLSpanElement>(".game-over-overlay__score-value--blue");
const gameOverOrangeScore = document.querySelector<HTMLSpanElement>(".game-over-overlay__score-value--orange");
const endOverlay = document.querySelector<HTMLDivElement>(".end-overlay");
const endWinnerText = document.querySelector<HTMLHeadingElement>(".end-overlay__winner");
const endLoserText = document.querySelector<HTMLParagraphElement>(".end-overlay__loser");
const endWinnerPawn = document.querySelector<HTMLImageElement>(".end-overlay__pawn");
const endBackButton = document.querySelector<HTMLButtonElement>(".end-overlay__back-btn");
let revealedCards: HTMLButtonElement[] = [];
let isComparingCards = false;
let hasEndSequenceStarted = false;
let currentPlayer: Player = getStoredStartingPlayer();
const scores: Record<Player, number> = {
    Blue: 0,
    Orange: 0,
};

function getStoredStartingPlayer(): Player {
    const storedPlayer = localStorage.getItem("memoryStartingPlayer");
    if (storedPlayer === "Blue" || storedPlayer === "Orange") {
        return storedPlayer;
    }
    return "Blue";
}

function getStoredTheme(): "code" | "food" {
    const storedTheme = localStorage.getItem("memoryTheme");
    if (storedTheme === "food") {
        return "food";
    }
    return "code";
}

function getThemeBuildFunction() {
    const theme = getStoredTheme();
    return theme === "food" ? buildFoodThemePairs : buildCodeThemePairs;
}

function getThemeBackSide() {
    const theme = getStoredTheme();
    return theme === "food" ? foodThemeBackSide : codeThemeBackSide;
}

function getPlayerLabelImage(player: Player) {
    if (player === "Orange") {
        return "/assets/label-orange.png";
    }
    return "/assets/label-blue.png";
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
        currentPlayerIcon.src = getPlayerLabelImage(currentPlayer);
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

function getSelectedCardCount() {
    const storedCardCount = localStorage.getItem("memoryCardCount");
    const parsedCardCount = storedCardCount ? Number.parseInt(storedCardCount, 10) : 16;

    if (parsedCardCount === 32) {
        localStorage.setItem("memoryCardCount", "36");
        return 36;
    }

    if (parsedCardCount === 16 || parsedCardCount === 24 || parsedCardCount === 36) {
        return parsedCardCount;
    }
    return 16;
}

function getGridColumnCount(cardCount: number) {
    if (cardCount === 24) return 6;
    if (cardCount === 36) return 6;
    return 4;
}

function getCardSize(_cardCount: number) {
    return 110;
}

function revealCard(card: HTMLButtonElement) {
    card.classList.add("is-revealed");
}

function hideCard(card: HTMLButtonElement) {
    card.classList.remove("is-revealed");
}

function isMatchingPair(firstCard: HTMLButtonElement, secondCard: HTMLButtonElement) {
    return firstCard.dataset.image === secondCard.dataset.image;
}

function lockMatchedPair(firstCard: HTMLButtonElement, secondCard: HTMLButtonElement) {
    firstCard.disabled = true;
    secondCard.disabled = true;
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
}

function resetRevealedCards() {
    revealedCards = [];
    isComparingCards = false;
}

function isGameFinished() {
    return grid.querySelectorAll<HTMLButtonElement>(".card:not(.is-matched)").length === 0;
}

function getWinnerData() {
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

function showEndOverlay() {
    if (!endOverlay || endOverlay.classList.contains("is-visible")) {
        return;
    }

    const winnerData = getWinnerData();

    if (endWinnerText) {
        endWinnerText.textContent = winnerData.winner;
        endWinnerText.classList.remove(
            "end-overlay__winner--blue",
            "end-overlay__winner--orange",
            "end-overlay__winner--draw",
        );
        endWinnerText.classList.add(winnerData.winnerClass);
    }

    if (endWinnerPawn) {
        endWinnerPawn.src = winnerData.pawn;
        endWinnerPawn.alt = winnerData.pawnAlt;
    }

    endOverlay.classList.add("is-visible");
    endOverlay.setAttribute("aria-hidden", "false");
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
    if (isComparingCards || card.classList.contains("is-revealed") || card.disabled) {
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

function renderGrid(){
    if(grid.innerHTML === ""){
        const cardCount = getSelectedCardCount();
        const columnCount = getGridColumnCount(cardCount);
        const cardSize = getCardSize(cardCount);
        const buildFunction = getThemeBuildFunction();
        const backSideImage = getThemeBackSide();
        const cardPairs = buildFunction(cardCount);

        grid.style.display = "grid";
        grid.style.gridTemplateColumns = `repeat(${columnCount}, ${cardSize}px)`;
        grid.style.gap = "20px";

        for(let i = 0; i < cardPairs.length; i++){
            const card = document.createElement("button");
            card.type = "button";
            card.classList.add("card", `card-${i}`);
            card.setAttribute("aria-label", `Memory card ${i + 1}`);
            card.dataset.image = cardPairs[i];
            card.addEventListener("click", () => handleCardClick(card));

            const cardInner = document.createElement("div");
            cardInner.classList.add("card__inner");

            const backFace = document.createElement("img");
            backFace.classList.add("card__face", "card__face--back");
            backFace.src = backSideImage;
            backFace.alt = "Card back";

            const frontFace = document.createElement("img");
            frontFace.classList.add("card__face", "card__face--front");
            frontFace.src = cardPairs[i];
            frontFace.alt = "Card front";

            cardInner.appendChild(backFace);
            cardInner.appendChild(frontFace);
            card.appendChild(cardInner);
            grid.appendChild(card);
        }
    }
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
renderGrid();
setupExitOverlay();
setupEndOverlay();