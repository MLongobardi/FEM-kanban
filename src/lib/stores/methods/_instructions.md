Store methods must take a copy of the store's values as the first argument (draft), and then apply changes to it. When you then call the method, skip the draft argument. Files in this folder should only export methods that modify the store. Methods that simply read values should go in the store's starting object.
Inside a method's code, draft is used to access the store values, and the "this" keyword to access the other store methods.
If a method's name start with an underscore ("\_"), it will be a hidden method: it won't be in the final store, but it can be used by the other methods.
Methods can return a value.
Example:

```js
/* In /methods/mainStore.js */
export function _storeMethodA(draft, firstArgument, secondArgument) {
	//hidden method
	draft.valueA = [firstArgument, secondArgument];
}

export function storeMethodB(draft) {
	draft.valueB = helperFunction(20);
	setTimeout(() => {
		this._storeMethodA(3, draft.valueC); //skips the draft argument
	}, 1000);
	return "world";
}

// Don't export helper functions
function helperFunction(n) {
	return n * 2;
}

/* In a .svelte file's script tag */
import { mainStore } from "$stores";
const world = mainStore.storeMethodB(); //storeMethodB is executed, its returned value is assigned to the variable
```
