<script>
	import { dialogStore, mainStore } from "$stores";
	export let colId, taskId, title, completed, total;
	let button;

	function redirectClick(e) {
		if (e.target != button) button.click();
	}

	function handleClick() {
		mainStore.beforeActionModal("EDIT", [colId, taskId]);
		$dialogStore.ADDEDITTASK.open();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<article class="task-card" on:click={redirectClick}>
	<h3 class="task-title">
		{title}
	</h3>
	{completed} of {total} subtasks
	<button bind:this={button} on:click|stopPropagation={handleClick}>View full task info</button>
</article>

<style lang="scss">
	.task-card {
		width: 100%;
		box-sizing: border-box;
		padding: 23px 16px;
		border-radius: 8px;
		background: white;
		margin-bottom: 20px;
		box-shadow: 0px 4px 6px rgba(54, 78, 126, 0.101545);
	}
	:global(.hoverable) .task-card:hover {
		cursor: pointer;
		& .task-title {
			color: var(--main-purple);
		}
	}
	.task-card:active {
		margin-top: 4px;
		margin-bottom: 16px;
		box-shadow: none;
	}
	:global(.dark) .task-card {
		background: var(--dark-grey);
	}
	.task-title {
		margin-bottom: 8px;
	}
	button {
		@extend %screen-reader-only;
	}
</style>
