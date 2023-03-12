import { writable } from "svelte/store";
import initializeStore from "./utility/initializeStore.js";
import * as mainStoreMethods from "./methods/mainStore.js";

const startObject = {
	counter: 0,

	get counterSquared() {
		return this.counter * this.counter;
	},

	counterTimesN(n) {
		return this.counter * n;
	},
};

const mainStore = initializeStore(writable(startObject), mainStoreMethods);
export default mainStore;
