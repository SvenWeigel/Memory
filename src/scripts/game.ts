import { buildCodeThemePairs, codeThemeBackSide } from "./cards";

type Player = "Blue" | "Orange";

let grid = document.querySelector(".game-board__grid") as HTMLDivElement;
const blueScore = document.querySelector<HTMLSpanElement>(".header__score-value--blue");
const orangeScore = document.querySelector<HTMLSpanElement>(".header__score-value--orange");
const currentPlayerName = document.querySelector<HTMLSpanElement>(".header__current-player__name");
const currentPlayerIcon = document.querySelector<HTMLImageElement>(".header__current-player__icon");
let revealedCards: HTMLButtonElement[] = [];
let isComparingCards = false;
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
    if (parsedCardCount === 16 || parsedCardCount === 24 || parsedCardCount === 32) {
        return parsedCardCount;
    }
    return 16;
}

function getGridColumnCount(cardCount: number) {
    if (cardCount === 24) return 6;
    if (cardCount === 32) return 8;
    return 4;
}

function getCardSize(cardCount: number) {
    if (cardCount === 24) return 84;
    if (cardCount === 32) return 64;
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

function checkRevealedCards() {
    const [firstCard, secondCard] = revealedCards;

    if (!firstCard || !secondCard) {
        resetRevealedCards();
        return;
    }

    if (isMatchingPair(firstCard, secondCard)) {
        awardPointToCurrentPlayer();
        lockMatchedPair(firstCard, secondCard);
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
        const cardPairs = buildCodeThemePairs(cardCount);

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
            backFace.src = codeThemeBackSide;
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

updateScoreboard();
updateCurrentPlayerDisplay();
renderGrid();