import { testAPI } from "$lib/server/db.js"
import {json} from "@sveltejs/kit"

export async function POST({ request }) {
    const {boardId, oldInfo, newInfo} = await request.json();
    testAPI("test", boardId, oldInfo, newInfo);
    return json("")
}