export default function initializeStore(store, storeMethods) {
	const hiddenMethods = ["set", "update"];

	for (let [methodName, method] of Object.entries(storeMethods)) {
		//lets custom methods use the "this" keyword to refer to the store
		method = method.bind(store);

		//custom methods that start with "_" will be hidden
		if (methodName[0] == "_") hiddenMethods.push(methodName);

		//applies the custom methods to the store
		store[methodName] = (...args) => {
			let returnedValue;
			store.update((draft) => {
				returnedValue = method(draft, ...args);
				return draft;
			});
			return returnedValue;
		};
	}

	//creates a new store without the hidden methods
	const returnStore = {};
	for (const met in store) {
		if (!hiddenMethods.includes(met)) {
			returnStore[met] = store[met];
		}
	}

	return returnStore;
}
