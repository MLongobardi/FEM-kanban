import { testAPI } from "$lib/server/db.js";
import { getId } from "$lib/server/utils.js";
import { json } from "@sveltejs/kit";

export async function POST({ cookies, request }) {
	const { boardId, oldInfo, newInfo } = await request.json();
	testAPI(getId(cookies), boardId, oldInfo, newInfo);
	return json("");
}
