import { writable } from "svelte/store";
import initializeStore from "./utility/initializeStore.js";
import * as mainStoreMethods from "./methods/mainStore.js";

const startObject = {
	currentBoard: 0,
	darkMode: true,
	showSidebarOnBigScreen: true,
};

const mainStore = initializeStore(writable(startObject), mainStoreMethods);
export default mainStore;
