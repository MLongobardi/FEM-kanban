import { invalidateAll } from "$app/navigation";

export default async function callDropTask(
	board,
	oldInfo,
	finalInfo,
	freezeDrag = () => {},
	completeDrag = () => {}
) {
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

	if (response.ok) {
		freezeDrag();
		await invalidateAll();
		completeDrag();
	} else {
		alert("Something went wrong, reverting drag and drop.");
		setTimeout(completeDrag, 10);
	}
}
