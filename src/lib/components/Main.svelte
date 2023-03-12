<script>
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import { mainStore } from "$stores";

    const optimistic = {
        using: false,
        data: {}
    }
</script>

<main>
	<h2>This is the main</h2>

    <form method="POST" action="?/add" use:enhance={({data})=>{
        optimistic.using = true;
        optimistic.data.addTest = data.get("addTest");

        return async ({ update }) => {
            await update();
            optimistic.using = false;
        }
    }}>
		testing ADD
		<input name="addTest" />
	</form>
	
	<form method="POST" action="?/reset" use:enhance={()=>{
        optimistic.using = true;
        optimistic.data = {};

        return async ({ update }) => {
            await update();
            optimistic.using = false;
        }
    }}>
		<input type="submit" name="resetTest" value="testing RESET"/>
	</form>

    <p>data.addTest: {optimistic.using ? optimistic.data.addTest : $page.data.addTest}</p>
    <p>Above data is currently being read by: {optimistic.using ? "component internal state" : "database"}</p>
</main>

<style>
    main {
        text-align: center;
    }
</style>