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
	if (target == "BOARD" && mode == "EDIT" && info) {
		draft.immediateNewColumn = true;
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
	draft.immediateNewColumn = false;
}

export function startDrag(draft, oldInfo) {
	if (draft.dragInProgress || draft.dragIsPending) return;
	draft.dragInProgress = true;
	draft.dragIsPending = true;
	draft.dragged = { oldInfo: oldInfo, newInfo: { colId: oldInfo.colId, taskId: oldInfo.taskId } };
}

export function updateDrag(draft, newInfo) {
	if (!draft.dragInProgress || !draft.dragIsPending) return;
	draft.dragged.newInfo = newInfo;
}

export function endDrag(draft) {
	if (!draft.dragInProgress || !draft.dragIsPending) return;
	draft.dragInProgress = false;
	if (
		draft.dragged.oldInfo.colId == draft.dragged.newInfo.colId &&
		draft.dragged.oldInfo.taskId == draft.dragged.newInfo.taskId
	) {
		this.completeDrag();
	} else {
		console.log("drag pending...");
		setTimeout(this.completeDrag, 3000); //temp
		//NOTE: when you will send a request to the backend to apply the changes
		//you will need to run this:
		//newInfo.taskId = Math.max(0, newInfo.taskId - 1)
		//when the temporary task is above the ghost (?)
	}
}

export function completeDrag(draft) {
	if (!draft.dragIsPending) return;
	console.log("drag completed");
	draft.dragIsPending = false;
	draft.dragged = {
		oldInfo: { colId: null, taskId: null },
		newInfo: { colId: null, taskId: null },
	};
}
