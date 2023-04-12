import { dropTask } from "$lib/server/db.js";
import { getId } from "$lib/server/utils.js";

export async function POST({ cookies, request }) {
	const { boardId, oldInfo, newInfo } = await request.json();
	
	await dropTask(getId(cookies), boardId, oldInfo, newInfo);
	return new Response(null, { status: 204 });
}
