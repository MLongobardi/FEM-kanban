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
	if (columnId == -1) {
		//create new column and add newTask to it?
		//this shouldn't happen though
	} else {
		data.boards[boardId].columns[columnId].tasks.push(newTask);
	}

	db.set(userId, data);
}

export function editTask(userId, taskInfo, newTask, subtasks) {
	if (!db.has(userId)) {
		db.set(userId, {});
	}

	const [boardId, columnId, taskId] = taskInfo;
	const data = db.get(userId);

	let oldSubtasks = data.boards[boardId].columns[columnId].tasks[taskId].subtasks;
	subtasks = subtasks.map((s) => {
		let i = oldSubtasks.findIndex((el) => el.title == s.title);
		if (i >= 0) s.isCompleted = oldSubtasks[i].isCompleted;
		return s;
	});
	newTask.subtasks = subtasks;

	//if (status didn't change)
	data.boards[boardId].columns[columnId].tasks[taskId] = newTask;
	//else
	//delete old task and add new?
	db.set(userId, data);
}

export function editTaskInView(userId, taskInfo, completedSubtasks, status) {
	const [boardId, columnId, taskId] = taskInfo;
	const data = db.get(userId);

	let task = data.boards[boardId].columns[columnId].tasks[taskId];
	task.status = status;
	task.subtasks = task.subtasks.map((s) => ({
		title: s.title,
		isCompleted: completedSubtasks.includes(s.title),
	}));
	data.boards[boardId].columns[columnId].tasks[taskId] = task;

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
	console.log(userId)
}

export function deleteBoard(userId, boardId) {
	const data = db.get(userId);
	data.boards.splice(boardId, 1);

	db.set(userId, data);
}
