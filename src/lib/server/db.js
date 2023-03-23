import testData from "./testData.json";

const db = new Map();

db.set("test", testData);

export function getData(userid) {
	return db.get(userid);
}

export function addDataTest(userid, newData) {
	if (!db.has(userid)) {
		db.set(userid, {});
	}

	const oldData = db.get(userid);

	db.set(userid, { ...oldData, ...newData });
}

export function resetDataTest(userid) {
	db.set(userid, testData);
}

export function addTask(userid, boardId, newTask) {
	if (!db.has(userid)) {
		db.set(userid, {});
	}

	/*
	let newTaskExample = {
		title: "Example",
		description: "Example description",
		status: "Todo",
		subtasks: [
			{
				title: "Subtask 1",
				isCompleted: true,
			},
            {
				title: "Subtask 2",
				isCompleted: false,
			},
		],
	};
	*/
    const data = db.get(userid);
    let columnId = data.boards[boardId].columns.findIndex((column) => column.name == newTask.status)
    if (columnId == -1) {
        //create new column and add newTask to it?
        //this shouldn't happen though
    } else {
        data.boards[boardId].columns[columnId].tasks.push(newTask);
    }

    db.set(userid, data);
}
