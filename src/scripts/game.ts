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

function renderGrid(){
    if(grid.innerHTML === ""){
        const cardCount = getSelectedCardCount();
        const columnCount = getGridColumnCount(cardCount);

        grid.style.display = "grid";
        grid.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
        grid.style.gap = "16px";
        grid.style.padding = "32px";

        for(let i = 0; i < cardCount; i++){
            const card = document.createElement("div");
            card.classList.add("card", `card-${i}`);
            grid.appendChild(card);
        }
    }
}

renderGrid();