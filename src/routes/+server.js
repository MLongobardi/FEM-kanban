import { testAPI } from "$lib/server/db.js";
import { json } from "@sveltejs/kit";
import { getId } from "$scripts";

export async function POST({ cookies, request }) {
	const { boardId, oldInfo, newInfo } = await request.json();
	testAPI(getId(cookies), boardId, oldInfo, newInfo);
	return json("");
}
