import { readable, derived } from "svelte/store";
import { mediaQueries } from "$lib/myConfig.js";

function camelToKebab(key) {
	return key
		.split(/(?=[A-Z])/) //multipleWordKey => ["multiple", "Word", "Key"]
		.join("-") //["multiple", "Word", "Key"] => multiple-Word-Key
		.toLowerCase(); //multiple-Word-Key => multiple-word-key
}

const screenClassStrings = Object.fromEntries(
	Object.keys(mediaQueries.screen).map((key, i, arr) => [
		key,
		arr
			.map((el) => (mediaQueries.screen[el].includes("min-width") ? camelToKebab(el) : "")) //no class for the mobile media query (which is the default style, mobile-first)
			.slice(0, i + 1)
			.join(" ")
			.slice(1),
	])
);

function createSingleStore(query) {
	return readable(null, (set) => {
		let stop = () => {};
		
		if (typeof window != "undefined") {
			const mq = window.matchMedia(query);
			const update = () => set(mq.matches);
			update();
			mq.addEventListener("change", update);
			stop = () => {
				mq.removeEventListener("change", update);
			};
		}

		return stop;
	});
}

function createGroupStore(queries) {
	const storesObject = {};
	for (const [queryName, queryString] of Object.entries(queries)) {
		storesObject[queryName] = createSingleStore(queryString);
	}
	return derived(Object.values(storesObject), ($stores) => {
		const objectToReturn = {};
		Object.keys(queries).forEach((key, i) => {
			objectToReturn[key] = $stores[i];
		});

		return objectToReturn;
	});
}

const screenStore = createGroupStore(mediaQueries.screen);
const miscStore = createGroupStore(mediaQueries.misc);

const mediaStore = derived([screenStore, miscStore], ([$screen, $misc]) => {
	const currentScreen = Object.keys($screen).find((key) => $screen[key] == true) || "";
	const miscClassString = Object.keys($misc)
		.filter((key) => $misc[key])
		.map(camelToKebab)
		.join(" ");

	return {
		screen: $screen,
		misc: $misc,
		currentScreen: currentScreen,
		bodyClassList: screenClassStrings[currentScreen] + " " + miscClassString || "",
	};
});

export default mediaStore;
