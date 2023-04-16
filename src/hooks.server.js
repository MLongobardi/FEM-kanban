import { start_mongo } from "$lib/server/mongo.js";

try {
	start_mongo();
	console.log("Mongo started");
} catch (e) {
	console.error(e);
}
