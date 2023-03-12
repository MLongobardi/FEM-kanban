export function incrementCounter(draft) {
	draft.counter++;
}

export function resetAfterN(draft, n) {
	setTimeout(this._hiddenMethod, n);
}

export function _hiddenMethod(draft) {
	draft.counter *= getZero();
}

/* Helper functions (don't export these) */
function getZero() {
	return 0;
}
