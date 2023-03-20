export function setBoard(draft, id) {
	if (draft.currentBoard != id) draft.currentBoard = id;
}

export function changeColorMode(draft, mode) {
	if (typeof mode == "boolean") draft.darkMode
	else draft.darkMode = !draft.darkMode;
}

export function toggleSidebar(draft) {
	draft.showSidebarOnBigScreen = !draft.showSidebarOnBigScreen;
}