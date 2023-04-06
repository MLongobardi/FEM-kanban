import testData from "./testData.json";
import startData from "./startData.json"

const db = new Map();

//4 tasks in the provided json have an empty status entry, this fixes them
testData.boards.forEach((board) => {
	board.columns.forEach((column) => {
		column.tasks.forEach((task) => {
			//if (!task.id) task.id = crypto.randomUUID(); //??
			if (task.status == "") task.status = column.name;
		});
	});
});

db.set("test", JSON.parse(JSON.stringify(testData))); //deep copy

export function getData(userId) {
	if (!db.get(userId)) {
		db.set(userId, JSON.parse(JSON.stringify(startData)));
	}

	return db.get(userId);
}

export function addTask(userId, boardId, newTask) {
	const data = db.get(userId);

	let allTaskTitles = [];
	data.boards[boardId].columns.forEach((col) => {
		allTaskTitles = allTaskTitles.concat(col.tasks.map((t) => t.title));
	});
	if (allTaskTitles.includes(newTask.title)) {
		throw new Error("Task titles should be unique");
	}

	//newTask.id = crypto.randomUUID(); //??

	let columnId = data.boards[boardId].columns.findIndex((column) => column.name == newTask.status);
	data.boards[boardId].columns[columnId].tasks.push(newTask);

	db.set(userId, data);
}

export function editTask(userId, taskInfo, newTask, subtasks) {
	const data = db.get(userId);
	const [boardId, columnId, taskId] = taskInfo;

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
	const data = db.get(userId);
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

	db.set(userId, data);
}

export function deleteTask(userId, taskInfo) {
	const data = db.get(userId);
	const [boardId, columnId, taskId] = taskInfo;
	
	data.boards[boardId].columns[columnId].tasks.splice(taskId, 1);

	db.set(userId, data);
}

export function addBoard(userId, newBoard) {
	const data = db.get(userId);
	data.boards.push(newBoard);

	db.set(userId, data);
}

export function editBoard(userId, boardId, newName, newColumns) {
	const data = db.get(userId);
	const board = data.boards[boardId];
	//if the columns that are going to be deleted aren't empty, send error
	board.name = newName;
	board.columns = newColumns.map((col, id) => ({
		name: col.name,
		tasks: board.columns[id] ? board.columns[id].tasks : [],
	}));
	data.boards[boardId] = board;
}

export function deleteBoard(userId, boardId) {
	const data = db.get(userId);
	data.boards.splice(boardId, 1);

	db.set(userId, data);
}

export function testAPI(userid, boardId, oldInfo, newInfo) {
	const data = db.get(userid);

	const task = data.boards[boardId].columns[oldInfo.col].tasks.splice(oldInfo.task, 1);
	data.boards[boardId].columns[newInfo.col].tasks.splice(newInfo.task, 0, ...task);

	db.set(userid, data);
}
