import * as db from "$lib/server/db.js";

export function load() {
	const id = "test";

	return db.getData(id);
}

export const actions = {
	addTask: async ({ request }) => {
		//await new Promise((fulfil) => setTimeout(fulfil, 1200)); //test delay
		const data = processData(await request.formData(), "TASK");
		const newTask = {
			title: data.title,
			description: data.description,
			status: data.status,
			subtasks: data.subtasks,
		};
		db.addTask("test", data.taskInfo[0], newTask);
	},

	editTask: async ({ request }) => {
		const data = processData(await request.formData(), "TASK");
		if (!data.subtasks) data.subtasks = [];
		const newTask = {
			title: data.title,
			description: data.description,
			status: data.status,
		};
		db.editTask("test", data.taskInfo, newTask, data.subtasks);
	},

	editTaskInView: async ({ request }) => {
		const data = processData(await request.formData(), "TASK");
		if (!data.completedSubtasks) data.completedSubtasks = [];
		db.editTaskInView("test", data.taskInfo, data.completedSubtasks, data.status);
	},

	deleteTask: async ({ request }) => {
		const data = processData(await request.formData(), "TASK");
		db.deleteTask("test", data.taskInfo);
	},

	addBoard: async ({ request }) => {
		const data = processData(await request.formData(), "BOARD");
		if (!data.columns) data.columns = [];
		const newBoard = {
			name: data.name,
			columns: data.columns,
		};
		db.addBoard("test", newBoard);
	},

	editBoard: async ({ request }) => {
		const data = processData(await request.formData(), "BOARD");
		if (!data.columns) data.columns = [];
		console.log("test", data);
	},

	deleteBoard: async ({ request }) => {
		const data = processData(await request.formData(), "BOARD");
		db.deleteBoard("test", data.boardId);
	},
};

const expectedKeys = {
	TASK: ["taskInfo", "title", "description", "subtasks", "status", "isCompleted"],
	BOARD: ["boardId", "name", "columns"],
};

function processData(preData, type) {
	const data = {};

	for (let [key, value] of preData) {
		if (!expectedKeys[type].includes(key)) continue;
		if (key == "subtasks" || key == "columns") {
			if (!data[key]) data[key] = [];
			if (!!value && !data[key].includes(value)) data[key] = data[key].concat(value);
		} else if (key == "taskInfo") data[key] = value.split(",");
		else if (key == "isCompleted") {
			if (!data.completedSubtasks) data.completedSubtasks = [];
			data.completedSubtasks = data.completedSubtasks.concat(value);
		} else data[key] = value;
	}

	if (data.subtasks) data.subtasks = data.subtasks.map((s) => ({ title: s, isCompleted: false }));
	if (data.columns) data.columns = data.columns.map((c) => ({ name: c, tasks: [] }));

	return data;
}
