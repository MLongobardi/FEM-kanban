import { invalidateAll } from "$app/navigation";

export default async function callDropTask(board, oldInfo, finalInfo, cb = () => {}) {
	const response = await fetch("/api/dropTask", {
		method: "POST",
		body: JSON.stringify({
			boardId: board,
			oldInfo: oldInfo,
			newInfo: finalInfo,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	//cb(); //before? (it's mainStore.completeDrag)
	setTimeout(() => {
	//cb()
	if (response.ok) {
		invalidateAll();
	} else {
		alert("Something went wrong, reverting drag and drop.");
	}
	cb();
	}, 2000);
	
	//setTimeout(cb, 100)
	//cb(); //or after?
}
