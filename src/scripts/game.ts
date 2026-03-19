import { buildCodeThemePairs, codeThemeBackSide } from "./cards";

let grid = document.querySelector(".game-board__grid") as HTMLDivElement;

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

renderGrid();