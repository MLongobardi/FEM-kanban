import { startMongo } from "$lib/server/mongo.js";

try {
	startMongo();
	console.log("Mongo connected");
} catch (e) {
	console.error(e);
}
