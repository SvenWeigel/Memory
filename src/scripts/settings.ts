function updateStartBtn(
  lists: NodeListOf<HTMLUListElement>,
  startBtn: HTMLButtonElement | null,
) {
  const allChecked = Array.from(lists).every(
    (list) =>
      list.querySelector<HTMLInputElement>("input[type='checkbox']:checked") !==
      null,
  );
  if (startBtn) startBtn.disabled = !allChecked;
}

function getCheckedLabel(groupSelector: string) {
  const checked = document.querySelector<HTMLInputElement>(
    `${groupSelector} .setting__options__list input[type='checkbox']:checked`,
  );
  const rawText = checked?.parentElement?.textContent ?? "";
  return rawText.trim();
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
    .querySelectorAll<HTMLInputElement>("input[type='checkbox']")
    .forEach((cb) => {
      if (cb !== target) cb.checked = false;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const lists = document.querySelectorAll<HTMLUListElement>(
    ".setting__options__list",
  );
  const startBtn = document.querySelector<HTMLButtonElement>("#start-btn");
  lists.forEach((list) => {
    list.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type !== "checkbox") return;
      uncheckOthers(list, target);
      updateStartBtn(lists, startBtn);
      updateChooseBarText();
    });
  });

  updateStartBtn(lists, startBtn);
  updateChooseBarText();
});

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    const boardSizeText = getCheckedLabel(".setting__board-size");
    const playerText = getCheckedLabel(".setting__choose-player");
    const selectedCards = Number.parseInt(boardSizeText, 10);
    if (!Number.isNaN(selectedCards)) {
      localStorage.setItem("memoryCardCount", String(selectedCards));
    }

    if (playerText === "Blue" || playerText === "Orange") {
      localStorage.setItem("memoryStartingPlayer", playerText);
    }

    window.location.href = "./game.html";
  });
});
