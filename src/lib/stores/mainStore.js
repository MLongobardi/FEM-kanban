import { writable } from "svelte/store";
import initializeStore from "./utility/initializeStore.js";
import * as mainStoreMethods from "./methods/mainStore.js";

const startObject = {
	currentBoard: 0,
	currentActionTarget: "", // "BOARD" | "TASK" | ""
	currentActionType: "", // "ADD" | "EDIT" | "VIEW" | "DELETE" | "DELETE" | ""
	currentTaskInEdit: {
		columnId: null,
		taskId: null,
	},
	immediateNewColumn: false,
	dragInProgress: false,
	dragIsPending: false,
	dragged: {
		oldInfo: { colId: null, taskId: null },
		newInfo: { colId: null, taskId: null },
		finalInfo: { colId: null, taskId: null }, //taskId can be different when task was moved within same column
	},
	darkMode: true,
	showSidebarOnBigScreen: true,
};

const mainStore = initializeStore(writable(startObject), mainStoreMethods);
export default mainStore;
