import testData from "./testData.json";

const db = new Map();

db.set("test", testData);

export function getData(userid) {
    return db.get(userid);
}

export function addData(userid, newData) {
    if (!db.has(userid)) {
        db.set(userid, {});
    }

    const oldData = db.get(userid);

    db.set(userid, {...oldData, ...newData})
}

export function resetData(userid) {
    db.set(userid, testData);
}