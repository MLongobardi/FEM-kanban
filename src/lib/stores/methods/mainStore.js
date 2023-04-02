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

export function beforeActionModal(draft, target, mode, info) {
	if (
		draft.currentActionTarget != "" ||
		draft.currentActionType != "" ||
		!["TASK", "BOARD"].includes(target) ||
		!["ADD", "EDIT", "VIEW", "DELETE"].includes(mode)
	) {
		console.log("mainStore.beforeActionModal error, target: ", target, " mode: ", mode);
		return;
	}

	draft.currentActionTarget = target;
	draft.currentActionType = mode;
	if (target == "TASK" && ["EDIT", "VIEW", "DELETE"].includes(mode)) {
		draft.currentTaskInEdit.columnId = info[0];
		draft.currentTaskInEdit.taskId = info[1];
	}
}

export function afterActionModal(draft) {
	if (draft.currentActionTarget == "" || draft.currentActionType == "") {
		console.log("mainStore.afterActionModal error");
		return;
	}

	draft.currentActionTarget = "";
	draft.currentActionType = "";
	draft.currentTaskInEdit.columnId = null;
	draft.currentTaskInEdit.taskId = null;
}
