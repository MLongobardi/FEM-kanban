<script>
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import { mainStore, mediaStore } from "$stores";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}

	function addTaskEnhance({ data }) {
		console.time("addTask");
		console.log('Adding task named "'+ data.get("title") +'"...');

		return async ({ update }) => {
			await update();
			console.timeEnd("addTask");
			console.log("Task added!");
		};
	}
</script>

<main>
	<form method="POST" action="?/addTask" use:enhance={addTaskEnhance} style="width: fit-content; margin: auto; margin-bottom: 20px">
		<input type="hidden" name="boardId" value={$mainStore.currentBoard} />
		<fieldset style="display: flex; flex-direction: column">
			<legend>Add New Task</legend>
			<input type="text" name="title" placeholder="title" required />
			<select name="status" required>
				{#each $page.data.boards[$mainStore.currentBoard].columns as c}
					<option value={c.name}>{c.name}</option>
				{/each}
			</select>
			<textarea name="description" placeholder="description" />
		</fieldset>
		<input type="submit" />
	</form>
	Current tasks (test):
	<div style="display: flex; margin: auto; width: fit-content">
		{#each $page.data.boards[$mainStore.currentBoard].columns as c}
			<div>
				<h2>{c.name}</h2>
				{#each c.tasks as t}
					<div style="margin: 10px; width: 250px">
						<h3>{t.title}</h3>
						{t.description}
					</div>
				{:else}
					<div style="margin: 10px; width: 250px">
						<h2>No Tasks!</h2>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	{#if $mediaStore.currentScreen != "mobile"}
		<!--double if block so that the transition only works on the second condition, thanks to |local-->
		{#if !$mainStore.showSidebarOnBigScreen}
			<button
				class="show-sidebar"
				on:click={mainStore.toggleSidebar}
				transition:reducedSlide|local={{ axis: "x", duration: 400, easing: quintOut }}
			>
				<img alt="show sidebar" src="/images/icon-show-sidebar.svg" />
			</button>
		{/if}
	{/if}
</main>

<style lang="scss">
	main {
		grid-area: main;
		text-align: center;
		background: var(--light-grey);
	}

	.show-sidebar {
		@extend %strip;
		width: 56px;
		position: absolute;
		bottom: 32px;
		background: var(--main-purple);
		padding: 0;
	}
	:global(.hoverable) .show-sidebar:hover {
		background: var(--main-purple-hover) !important;
	}
	.show-sidebar img {
		display: block;
		margin: auto;
	}
</style>
