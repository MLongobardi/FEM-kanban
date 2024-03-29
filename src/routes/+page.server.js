import { fail } from "@sveltejs/kit";
import * as db from "$lib/server/db.js";
import { getId, getCookieExpireDate } from "$lib/server/utils.js";

export function load({ cookies }) {
	let id = getId(cookies);
	if (!id || id == "test") {
		//new user
		cookies.set("userId", crypto.randomUUID(), { path: "/", expires: getCookieExpireDate() });
		id = getId(cookies);
	} else {
		//refreshes expire date
		cookies.set("userId", id, { path: "/", expires: getCookieExpireDate() });
	}

	return db.getData(id, true) ?? {};
}

export const actions = {
	addTask: async ({ cookies, request }) => {
		const data = processData(await request.formData(), "TASK");
		const newTask = {
			title: data.title,
			description: data.description,
			status: data.status,
			subtasks: data.subtasks,
		};
		try {
			await db.addTask(getId(cookies), data.taskInfo[0], newTask);
		} catch (error) {
			const e = { error: error.message };
			if (error.message == "Task titles should be unique") {
				e.title = data.title;
			}
			return fail(422, e);
		}
	},

	editTask: async ({ cookies, request }) => {
		const data = processData(await request.formData(), "TASK");
		if (!data.subtasks) data.subtasks = [];
		const newTask = {
			title: data.title,
			description: data.description,
			status: data.status,
		};
		try {
			await db.editTask(getId(cookies), data.taskInfo, newTask, data.subtasks);
		} catch (error) {
			return fail(422, {
				title: data.title,
				error: error.message,
			});
		}
	},

	editTaskInView: async ({ cookies, request }) => {
		const data = processData(await request.formData(), "TASK");
		if (!data.completedSubtasks) data.completedSubtasks = [];
		await db.editTaskInView(getId(cookies), data.taskInfo, data.completedSubtasks, data.status);
	},

	deleteTask: async ({ cookies, request }) => {
		const data = processData(await request.formData(), "TASK");
		await db.deleteTask(getId(cookies), data.taskInfo);
	},

	addBoard: async ({ cookies, request }) => {
		const data = processData(await request.formData(), "BOARD");
		if (!data.columns) data.columns = [];
		const newBoard = {
			name: data.name,
			columns: data.columns,
		};
		try {
			await db.addBoard(getId(cookies), newBoard);
		} catch (error) {
			return fail(422, {
				error: error.message,
			});
		}
	},

	editBoard: async ({ cookies, request }) => {
		const data = processData(await request.formData(), "BOARD");
		if (!data.columns) data.columns = [];
		try {
			await db.editBoard(getId(cookies), data.boardId, data.name, data.columns);
		} catch (error) {
			return fail(422, {
				error: error.message,
			});
		}
	},

	deleteBoard: async ({ cookies, request }) => {
		const data = processData(await request.formData(), "BOARD");
		await db.deleteBoard(getId(cookies), data.boardId);
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
		if (typeof value == "string") value = value.trim();
		if (key == "subtasks" || key == "columns") {
			if (!data[key]) data[key] = [];
			if (value) data[key] = data[key].concat(value);
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
