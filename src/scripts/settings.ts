function updateStartBtn(
  lists: NodeListOf<HTMLUListElement>,
  startBtn: HTMLButtonElement | null,
) {
  const allChecked = Array.from(lists).every(
    (list) =>
      list.querySelector<HTMLInputElement>("input[type='radio']:checked") !==
      null,
  );
  if (startBtn) startBtn.disabled = !allChecked;
}

function getCheckedLabel(groupSelector: string) {
  const checked = document.querySelector<HTMLInputElement>(
    `${groupSelector} .setting__options__list input[type='radio']:checked`,
  );
  const rawText = checked?.parentElement?.textContent ?? "";
  return rawText.trim();
}

function updatePreview() {
  const themeText = getCheckedLabel(".setting__game-themes");
  const previewImg = document.querySelector<HTMLImageElement>(".pre-view-game img");
  
  if (previewImg) {
    if (themeText.includes("Food")) {
      previewImg.src = "/assets/preview-food.png";
    } else {
      previewImg.src = "/assets/preview-code.png";
    }
  }
}

function updateChooseBarText() {
  const themeText = getCheckedLabel(".setting__game-themes");
  const playerText = getCheckedLabel(".setting__choose-player");
  const sizeText = getCheckedLabel(".setting__board-size");
  const themeSpan =
    document.querySelector<HTMLSpanElement>(".choose-bar__theme");
  const playerSpan = document.querySelector<HTMLSpanElement>(
    ".choose-bar__player",
  );
  const sizeSpan = document.querySelector<HTMLSpanElement>(".choose-bar__size");
  if (themeSpan && themeText) themeSpan.textContent = themeText;
  if (playerSpan && playerText) playerSpan.textContent = playerText;
  if (sizeSpan && sizeText) sizeSpan.textContent = sizeText;
}

function uncheckOthers(list: HTMLUListElement, target: HTMLInputElement) {
  list
    .querySelectorAll<HTMLInputElement>("input[type='radio']")
    .forEach((cb) => {
      if (cb !== target) cb.checked = false;
    });
}

function setupStartButton(startBtn: HTMLButtonElement | null) {
  startBtn?.addEventListener("click", () => {
    const boardSizeText = getCheckedLabel(".setting__board-size");
    const playerText = getCheckedLabel(".setting__choose-player");
    const themeText = getCheckedLabel(".setting__game-themes");
    const selectedCards = Number.parseInt(boardSizeText, 10);

    if (!Number.isNaN(selectedCards)) {
      localStorage.setItem("memoryCardCount", String(selectedCards));
    }
    if (playerText === "Blue" || playerText === "Orange") {
      localStorage.setItem("memoryStartingPlayer", playerText);
    }
    if (themeText.includes("Food")) {
      localStorage.setItem("memoryTheme", "food");
    } else {
      localStorage.setItem("memoryTheme", "code");
    }
    window.location.href = "./game.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const lists = document.querySelectorAll<HTMLUListElement>(
    ".setting__options__list",
  );
  const startBtn = document.querySelector<HTMLButtonElement>("#start-btn");
  const themesList = document.querySelector<HTMLUListElement>(
    ".setting__game-themes .setting__options__list",
  );
  
  lists.forEach((list) => {
    list.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type !== "radio") return;
      uncheckOthers(list, target);
      updateStartBtn(lists, startBtn);
      updateChooseBarText();
      
      if (list === themesList) {
        updatePreview();
      }
    });
  });

  setupStartButton(startBtn);
  
  updateStartBtn(lists, startBtn);
  updateChooseBarText();
  updatePreview();
});
