import { MongoClient } from "mongodb";
import { MONGO_URL } from "$env/static/private";

const client = new MongoClient(MONGO_URL);

export function startMongo() {
    console.log("Connecting to mongo...");
    return client.connect();
}

export default client.db("fem_kanban_task_management").collection("userData");