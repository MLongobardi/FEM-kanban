import * as db from "$lib/server/db.js";

export function load() {
	const id = "test";

	return db.getData(id);
}

export const actions = {
	addTest: async ({ request }) => {
		await new Promise((fulfil) => setTimeout(fulfil, 1200));

		const data = await request.formData();
		console.log(data.get("addTest"));
		db.addDataTest("test", { addTest: data.get("addTest") });
	},

	resetTest: async () => {
		await new Promise((fulfil) => setTimeout(fulfil, 1200));

		db.resetDataTest("test");
	},

	addTask: async ({ request }) => {
		const info = await request.formData();
		const boardId = info.get("boardId");
		const column = info.get("status");
		const newTask = {
			title: info.get("title"),
			status: column,
			description: info.get("description"),
			subtasks: info.get("subtasks"),
		};
		db.addTask("test", boardId, newTask);
	},
};
