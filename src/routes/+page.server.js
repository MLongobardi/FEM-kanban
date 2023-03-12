import * as db from "$lib/server/db.js";

export function load() {
    const id = "test";

    return db.getData(id);
}

export const actions = {
    add: async ({ request }) => {
        await new Promise((fulfil) => setTimeout(fulfil, 1500));

        const data = await request.formData();
        db.addData("test", { addTest: data.get("addTest") });
    },

    reset: async () => {
        await new Promise((fulfil) => setTimeout(fulfil, 1500));

        db.resetData("test")
    }
}