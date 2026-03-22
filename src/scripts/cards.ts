export const codeThemeBackSide = "/code-theme/back-side-code-theme.png";

export const codeThemeCardImages = [
	"/code-theme/angular-icon.png",
	"/code-theme/bootstrap-icon.png",
	"/code-theme/comand-icon.png",
	"/code-theme/css-icon.png",
	"/code-theme/data-icon.png",
	"/code-theme/dj-icon.png",
	"/code-theme/firebase-icon.png",
	"/code-theme/git-icon.png",
	"/code-theme/github-icon.png",
	"/code-theme/html-icon.png",
	"/code-theme/js-icon.png",
	"/code-theme/note-icon.png",
	"/code-theme/pyhton-icon.png",
	"/code-theme/react.icon.png",
	"/code-theme/sass-icon.png",
	"/code-theme/ts-icon.png",
	"/code-theme/v-icon.png",
	"/code-theme/vsc-icon.png",
];

export const foodThemeBackSide = "/food-theme/back-side-food-theme.png";

export const foodThemeCardImages = [
	"/food-theme/bowle.png",
	"/food-theme/bucket.png",
	"/food-theme/burger.png",
	"/food-theme/cake.png",
	"/food-theme/chocolate.png",
	"/food-theme/corndog.png",
	"/food-theme/donut.png",
	"/food-theme/frise.png",
	"/food-theme/ice.png",
	"/food-theme/macarons.png",
	"/food-theme/muffin.png",
	"/food-theme/pizza.png",
	"/food-theme/pretzel.png",
	"/food-theme/pudding.png",
	"/food-theme/sandwich.png",
	"/food-theme/sushi.png",
	"/food-theme/tacco.png",
	"/food-theme/wrap.png",
];

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const current = copy[i];
		copy[i] = copy[j];
		copy[j] = current;
	}
	return copy;
}

export function buildCodeThemePairs(cardCount: number): string[] {
	const pairCount = cardCount / 2;
	if (!Number.isInteger(pairCount) || pairCount < 1) {
		return [];
	}

	if (pairCount > codeThemeCardImages.length) {
		throw new Error("Not enough card images for selected board size.");
	}

	const randomizedFaces = shuffle(codeThemeCardImages).slice(0, pairCount);
	return shuffle([...randomizedFaces, ...randomizedFaces]);
}

export function buildFoodThemePairs(cardCount: number): string[] {
	const pairCount = cardCount / 2;
	if (!Number.isInteger(pairCount) || pairCount < 1) {
		return [];
	}

	if (pairCount > foodThemeCardImages.length) {
		throw new Error("Not enough card images for selected board size.");
	}

	const randomizedFaces = shuffle(foodThemeCardImages).slice(0, pairCount);
	return shuffle([...randomizedFaces, ...randomizedFaces]);
}
