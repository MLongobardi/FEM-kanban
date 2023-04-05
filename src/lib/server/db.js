import testData from "./testData.json";

const db = new Map();

db.set("test", testData);

export function getData(userId) {
	return db.get(userId);
}

export function addTask(userId, boardId, newTask) {
	if (!db.has(userId)) {
		db.set(userId, {});
	}

	const data = db.get(userId);
	let columnId = data.boards[boardId].columns.findIndex((column) => column.name == newTask.status);
	data.boards[boardId].columns[columnId].tasks.push(newTask);

	db.set(userId, data);
}

export function editTask(userId, taskInfo, newTask, subtasks) {
	if (!db.has(userId)) {
		db.set(userId, {});
	}

	const [boardId, columnId, taskId] = taskInfo;
	const data = db.get(userId);

	let oldTask = data.boards[boardId].columns[columnId].tasks[taskId];
	subtasks = subtasks.map((s) => {
		let i = oldTask.subtasks.findIndex((el) => el.title == s.title);
		if (i >= 0) s.isCompleted = oldTask.subtasks[i].isCompleted;
		return s;
	});
	newTask.subtasks = subtasks;

	if (oldTask.status == newTask.status) {
		data.boards[boardId].columns[columnId].tasks[taskId] = newTask;
	} else {
		let newColumnId = data.boards[boardId].columns.findIndex(
			(column) => column.name == newTask.status
		);
		data.boards[boardId].columns[columnId].tasks.splice(taskId, 1);
		data.boards[boardId].columns[newColumnId].tasks.push(newTask);
	}

	db.set(userId, data);
}

export function editTaskInView(userId, taskInfo, completedSubtasks, newStatus) {
	const [boardId, columnId, taskId] = taskInfo;
	const data = db.get(userId);

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

	db.set(userId, data);
}

export function deleteTask(userId, taskInfo) {
	const [boardId, columnId, taskId] = taskInfo;
	const data = db.get(userId);
	data.boards[boardId].columns[columnId].tasks.splice(taskId, 1);

	db.set(userId, data);
}

export function addBoard(userId, newBoard) {
	const data = db.get(userId);
	data.boards.push(newBoard);

	db.set(userId, data);
}

export function editBoard(userId) {
	console.log(userId);
}

export function deleteBoard(userId, boardId) {
	const data = db.get(userId);
	data.boards.splice(boardId, 1);

	db.set(userId, data);
}
