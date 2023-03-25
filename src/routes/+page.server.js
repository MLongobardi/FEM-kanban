import * as db from "$lib/server/db.js";

export function load() {
	const id = "test";

	return db.getData(id);
}

export const actions = {
	addTask: async ({ request }) => {
		//await new Promise((fulfil) => setTimeout(fulfil, 1200)); //test delay
		const data = processTaskData(await request.formData());
		const newTask = {
			title: data.title,
			description: data.description,
			status: data.status,
			subtasks: data.subtasks,
		};
		db.addTask("test", data.taskInfo[0], newTask);
	},

	editTask: async ({ request }) => {
		const data = processTaskData(await request.formData());
		const newTask = {
			title: data.title,
			description: data.description,
			status: data.status,
		}
		db.editTask("test", data.taskInfo, newTask, data.subtasks)
	},
};

function processTaskData(preData) {
	const data = {};
	data.subtasks = [];

	for (let [key, value] of preData) {
		if (key == "subtasks") {
			if (!!value && !data[key].includes(value)) data[key] = data[key].concat(value);
		}
		else if (key == "taskInfo") data[key] = value.split(",");
		else data[key] = value;
	}

	data.subtasks = data.subtasks.map((s) => ({ title: s, isCompleted: false }));

	return data;
}
