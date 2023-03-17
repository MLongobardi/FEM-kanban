<script>
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";

	const optimistic = {
		using: false,
		data: {},
	};

	function addEnhance({ data }) {
		optimistic.using = true;
		optimistic.data.addTest = data.get("addTest");

		return async ({ update }) => {
			await update();
			optimistic.using = false;
		};
	}

	function resetEnhance() {
		optimistic.using = true;
		optimistic.data = {};

		return async ({ update }) => {
			await update();
			optimistic.using = false;
		};
	}
</script>

<main>
	<h2>DB Test:</h2>

	<form method="POST" action="?/add" use:enhance={addEnhance}>
		testing ADD
		<input name="addTest" />
	</form>

	<form method="POST" action="?/reset" use:enhance={resetEnhance}>
		<input type="submit" name="resetTest" value="testing RESET" />
	</form>

	<p>data.addTest: {optimistic.using ? optimistic.data.addTest : $page.data.addTest}</p>
	<p>
		Above data is currently being read by: {optimistic.using
			? "component internal state"
			: "database"}
	</p>
</main>

<style>
	main {
		grid-area: main;
		text-align: center;
		background: var(--light-grey);
	}
</style>
