function updateStartBtn(lists: NodeListOf<HTMLUListElement>, startBtn: HTMLButtonElement | null) {
  const allChecked = Array.from(lists).every((list) =>
    list.querySelector<HTMLInputElement>("input[type='checkbox']:checked") !== null
  );
  if (startBtn) startBtn.disabled = !allChecked;
}

function uncheckOthers(list: HTMLUListElement, target: HTMLInputElement) {
  list.querySelectorAll<HTMLInputElement>("input[type='checkbox']").forEach((cb) => {
    if (cb !== target) cb.checked = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const lists = document.querySelectorAll<HTMLUListElement>(".setting__options__list");
  const startBtn = document.querySelector<HTMLButtonElement>("#start-btn");
  lists.forEach((list) => {
    list.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type !== "checkbox") return;
      uncheckOthers(list, target);
      updateStartBtn(lists, startBtn);
    });
  });

  updateStartBtn(lists, startBtn);
});
