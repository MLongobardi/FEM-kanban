import mongo from "$lib/server/mongo.js";
import testData from "./testData.json";
import startData from "./startData.json";

const taskIdsMap = new Map(); //needed to manage drag and drop animation

//4 tasks in the provided json have an empty status entry, this fixes them
//also applies an unique id to each task, to manage animations
function fixJson(data) {
	data.boards.forEach((board) => {
		board.columns.forEach((column) => {
			column.tasks.forEach((task) => {
				task.id = crypto.randomUUID();
				if (task.status == "") task.status = column.name;
			});
		});
	});
}

function generateIdMap(userId, data) {
	if (taskIdsMap.has(userId)) return; //only the first time
	const newIds = {};

	data.boards.forEach((board) => {
		board.columns.forEach((column) => {
			column.tasks.forEach((task) => {
				newIds[task.id] = task.id;
			});
		});
	});

	taskIdsMap.set(userId, newIds);
}

function mergeDbAndMap(userId, dbData) {
	dbData.boards.forEach((board) => {
		board.columns.forEach((column) => {
			column.tasks.forEach((task) => {
				task.id = taskIdsMap.get(userId)[task.id];
			});
		});
	});

	return dbData;
}

async function setData(userId, newData) {
	await mongo.findOneAndUpdate(
		{ "user-key": userId },
		{
			$set: { kanbanData: newData },
		}
	);
}

export async function getData(userId, mergeIds = false) {
	if (userId == "test") {
		let data = await mongo.findOne({ "user-key": "test" });

		//shouldn't happen, but just in case
		if (!data) {
			fixJson(testData);
			await mongo.insertOne({
				"user-key": "test",
				kanbanData: testData,
			});
			data = await mongo.findOne({ "user-key": "test" });
		}
		generateIdMap("test", data.kanbanData);
		return mergeIds ? mergeDbAndMap("test", data.kanbanData) : data.kanbanData;
	}

	//not test
	let data = await mongo.findOneAndUpdate(
		{ "user-key": userId },
		{
			$currentDate: { "last-access": true },
		},
		{ returnDocument: "after" }
	);

	if (!data.value) {
		fixJson(startData);
		await mongo.insertOne({
			"user-key": userId,
			"last-access": new Date(),
			kanbanData: startData,
		});
		data = { value: await mongo.findOne({ "user-key": userId }) };
	}
	generateIdMap(userId, data.value.kanbanData);
	return mergeIds ? mergeDbAndMap(userId, data.value.kanbanData) : data.value.kanbanData;
}

export async function addTask(userId, boardId, newTask) {
	const data = await getData(userId);

	let allTaskTitles = [];
	data.boards[boardId].columns.forEach((col) => {
		allTaskTitles = allTaskTitles.concat(col.tasks.map((t) => t.title));
	});
	if (allTaskTitles.includes(newTask.title)) {
		throw new Error("Task titles should be unique");
	}
	let newId = crypto.randomUUID();
	newTask.id = newId;
	taskIdsMap.get(userId)[newId] = newId;
	let columnId = data.boards[boardId].columns.findIndex((column) => column.name == newTask.status);
	data.boards[boardId].columns[columnId].tasks.push(newTask);

	await setData(userId, data);
}

export async function editTask(userId, taskInfo, newTask, subtasks) {
	const data = await getData(userId);

	const [boardId, columnId, taskId] = taskInfo;
	let oldTask = data.boards[boardId].columns[columnId].tasks[taskId];
	subtasks = subtasks.map((s) => {
		let i = oldTask.subtasks.findIndex((el) => el.title == s.title);
		if (i >= 0) s.isCompleted = oldTask.subtasks[i].isCompleted;
		return s;
	});
	newTask.subtasks = subtasks;
	newTask.id = oldTask.id;
	if (oldTask.status == newTask.status) {
		//trigger animation
		let newId = crypto.randomUUID();
		newTask.id = newId;
		taskIdsMap.get(userId)[newId] = newId;
		data.boards[boardId].columns[columnId].tasks[taskId] = newTask;
	} else {
		let newColumnId = data.boards[boardId].columns.findIndex(
			(column) => column.name == newTask.status
		);
		data.boards[boardId].columns[columnId].tasks.splice(taskId, 1);
		data.boards[boardId].columns[newColumnId].tasks.push(newTask);
	}

	await setData(userId, data);
}

export async function editTaskInView(userId, taskInfo, completedSubtasks, newStatus) {
	const data = await getData(userId);

	const [boardId, columnId, taskId] = taskInfo;
	let task = data.boards[boardId].columns[columnId].tasks[taskId];
	task.subtasks = task.subtasks.map((s) => ({
		title: s.title,
		isCompleted: completedSubtasks.includes(s.title),
	}));
	if (task.status == newStatus) {
		data.boards[boardId].columns[columnId].tasks[taskId] = task;
	} else {
		let newColumnId = data.boards[boardId].columns.findIndex((column) => column.name == newStatus);
		if (newColumnId < 0) console.log("editTaskInView error");
		task.status = newStatus;
		data.boards[boardId].columns[columnId].tasks.splice(taskId, 1);
		data.boards[boardId].columns[newColumnId].tasks.push(task);
	}

	await setData(userId, data);
}

export async function deleteTask(userId, taskInfo) {
	const data = await getData(userId);

	const [boardId, columnId, taskId] = taskInfo;
	data.boards[boardId].columns[columnId].tasks.splice(taskId, 1);

	await setData(userId, data);
}

export async function addBoard(userId, newBoard) {
	const data = await getData(userId);

	data.boards.push(newBoard);

	await setData(userId, data);
}

export async function editBoard(userId, boardId, newName, newColumns) {
	const data = await getData(userId);

	const board = data.boards[boardId];
	//if the columns that are going to be deleted aren't empty, send error
	board.name = newName;
	board.columns = newColumns.map((col, id) => ({
		name: col.name,
		tasks: board.columns[id] ? board.columns[id].tasks : [],
	}));
	data.boards[boardId] = board;

	await setData(userId, data);
}

export async function deleteBoard(userId, boardId) {
	const data = await getData(userId);

	data.boards.splice(boardId, 1);

	await setData(userId, data);
}

export async function dropTask(userId, boardId, oldInfo, newInfo) {
	const data = await getData(userId);

	const task = data.boards[boardId].columns[oldInfo.colId].tasks.splice(oldInfo.taskId, 1)[0];
	task.status = data.boards[boardId].columns[newInfo.colId].name;
	let idMap = taskIdsMap.get(userId);
	idMap[task.id] = idMap[task.id] + "d" + "*".repeat(newInfo.colId + 1);
	data.boards[boardId].columns[newInfo.colId].tasks.splice(newInfo.taskId, 0, task);

	await setData(userId, data);
}
