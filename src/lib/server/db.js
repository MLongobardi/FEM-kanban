import testData from "./testData.json";

const db = new Map();

db.set("test", testData);

export function getData(userid) {
	return db.get(userid);
}

export function addTask(userid, boardId, newTask) {
	if (!db.has(userid)) {
		db.set(userid, {});
	}

	const data = db.get(userid);
	let columnId = data.boards[boardId].columns.findIndex((column) => column.name == newTask.status);
	if (columnId == -1) {
		//create new column and add newTask to it?
		//this shouldn't happen though
	} else {
		data.boards[boardId].columns[columnId].tasks.push(newTask);
	}

	db.set(userid, data);
}

export function editTask(userid, taskInfo, newTask, subtasks) {
	if (!db.has(userid)) {
		db.set(userid, {});
	}

	const [boardId, columnId, taskId] = taskInfo;
	const data = db.get(userid);

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
	db.set(userid, data);
}
