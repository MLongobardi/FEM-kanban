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
		if (!data.subtasks) data.subtasks = [];
		const newTask = {
			title: data.title,
			description: data.description,
			status: data.status,
		};
		db.editTask("test", data.taskInfo, newTask, data.subtasks);
	},

	editTaskInView: async ({ request }) => {
		const data = processTaskData(await request.formData());
		if (!data.completedSubtasks) data.completedSubtasks = [];
		db.editTaskInView("test", data.taskInfo, data.completedSubtasks, data.status);
	}
};

const expectedKeys = {
	task: ["taskInfo", "title", "description", "subtasks", "status", "isCompleted"],
};

function processTaskData(preData) {
	const data = {};

	for (let [key, value] of preData) {
		if (!expectedKeys.task.includes(key)) continue;
		if (key == "subtasks") {
			if (!data.subtasks) data.subtasks = [];
			if (!!value && !data[key].includes(value)) data[key] = data[key].concat(value);
		} else if (key == "taskInfo") data[key] = value.split(",");
		else if (key == "isCompleted") {
			if (!data.completedSubtasks) data.completedSubtasks = [];
			data.completedSubtasks = data.completedSubtasks.concat(value);
		} else data[key] = value;
	}

	if (data.subtasks) data.subtasks = data.subtasks.map((s) => ({ title: s, isCompleted: false }));

	return data;
}
