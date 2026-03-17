import './styles/style.scss';

function initEventListenersInput(): void {
    addClickListener('play-btn', () => {
        window.location.href = "./src/pages/settings.html";
    });
}

function addClickListener(id: string, callback: () => void): void {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', callback);
    }
}

initEventListenersInput();