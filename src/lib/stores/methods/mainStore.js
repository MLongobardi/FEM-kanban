export function setBoard(draft, id) {
	if (draft.currentBoard != id) draft.currentBoard = id;
}

export function changeColorMode(draft, mode) {
	if (typeof mode == "boolean") draft.darkMode = mode;
	else draft.darkMode = !draft.darkMode;
}

export function toggleSidebar(draft) {
	draft.showSidebarOnBigScreen = !draft.showSidebarOnBigScreen;
}

export function beforeActionModal(draft, mode, info) {
	if (draft.currentActionType != "") {
		console.log("mainStore.beforeActionModal error");
		return;
	}
	draft.currentActionType = mode;
	if (mode == "EDIT") {
		draft.currentTaskInEdit.columnId = info[0];
		draft.currentTaskInEdit.taskId = info[1];
	}
}

export function afterActionModal(draft) {
	if (draft.currentActionType == "") {
		console.log("mainStore.afterActionModal error");
		return;
	}
	draft.currentActionType = "";
	draft.currentTaskInEdit.columnId = null;
	draft.currentTaskInEdit.taskId = null;
}