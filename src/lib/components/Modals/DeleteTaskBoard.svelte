<script>
	import { dialogStore, mainStore } from "$stores";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";

	export let inTransition;

	let isTask = $mainStore.currentActionTarget == "TASK";
	let task, columnId, taskId;
	let board = $page.data.boards[$mainStore.currentBoard];
	if (isTask) {
		columnId = $mainStore.currentTaskInEdit.columnId;
		taskId = $mainStore.currentTaskInEdit.taskId;
		task = board.columns[columnId].tasks[taskId];
	}
</script>

<div in:inTransition>
	<h2>Delete this {isTask ? "task" : "board"}?</h2>
	<p>
		{#if isTask}
			Are you sure you want to delete the ‘{task.title}’ task and its subtasks? This action cannot
			be reversed.
		{:else}
			Are you sure you want to delete the ‘{board.name}’ board? This action will remove all columns
			and tasks and cannot be reversed.
		{/if}
	</p>

	<form
		method="POST"
		action={isTask ? "?/deleteTask" : "?/deleteBoard"}
		use:enhance={() => {
			return async ({ update }) => {
				if (!isTask) mainStore.setBoard(Math.max(0, $mainStore.currentBoard - 1));
				await update();
				$dialogStore.DELETETASKBOARD.close();
			};
		}}
	>
		{#if isTask}
			<input type="hidden" name="taskInfo" value={[$mainStore.currentBoard, columnId, taskId]} />
		{:else}
			<input type="hidden" name="boardId" value={$mainStore.currentBoard} />
		{/if}
		<input type="submit" value="Delete" />
		<button type="button" on:click={$dialogStore.DELETETASKBOARD.close}>Cancel</button>
	</form>
</div>

<style lang="scss">
	h2 {
		color: var(--red);
	}

	p {
		@extend %body-L;
		margin: 24px 0;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	:global(.tablet) form {
		flex-direction: row;
		margin-bottom: 8px;
	}

	input,
	button {
		@extend %body-L;
		background: rgba(99, 95, 199, 0.1);
		color: var(--main-purple);
		font-weight: 700;
		border: none;
		height: 40px;
		width: 100%;
		border-radius: 20px;
	}
	input {
		--btn-color-var-1: var(--red);
		--btn-color-hov-1: var(--red-hover);
		background: var(--btn-color-var-1);
		color: white;
	}
	:global(.hoverable) button:hover {
		background: rgba(99, 95, 199, 0.25);
	}
	:global(.dark) button {
		background: white !important;
	}
</style>
