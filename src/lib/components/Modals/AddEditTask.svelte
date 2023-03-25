<script>
	import { dialogStore, mainStore } from "$stores";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";

	let columns = $page.data.boards[$mainStore.currentBoard].columns;
	let task, columnId, taskId;
	let isAdd = $mainStore.currentActionType == "ADD";
	let subtasks = [
		{ title: "", isCompleted: false },
		{ title: "", isCompleted: false },
	];
	if (!isAdd) {
		//isEdit
		columnId = $mainStore.currentTaskInEdit.columnId;
		taskId = $mainStore.currentTaskInEdit.taskId;
		task = columns[columnId].tasks[taskId];
		if (task.subtasks.length >= 1) subtasks = task.subtasks;
	}

	function addSubtask() {
		subtasks = [...subtasks, { title: "", isCompleted: false }];
	}
	function removeSubtask(id) {
		subtasks = [...subtasks.slice(0, id), ...subtasks.slice(id + 1)];
	}

	function testEnhance() {
		let timeId = isAdd ? "addTask" : "editTask";
		console.time(timeId);

		return async ({ update }) => {
			await update();
			console.timeEnd(timeId);
		};
	}
</script>

<div>
	<h2>
		{#if isAdd}
			Add New Task
		{:else}
			Edit Task
		{/if}
	</h2>
	<form
		method="POST"
		action={isAdd ? "?/addTask" : "?/editTask"}
		use:enhance={testEnhance}
		on:submit={$dialogStore.ADDEDITTASK.close}
	>
		<input
			type="hidden"
			name="taskInfo"
			value={[$mainStore.currentBoard].concat(isAdd ? [] : [columnId, taskId])}
		/>
		<fieldset>
			<legend>Title</legend>
			<input
				type="text"
				name="title"
				placeholder="e.g. Take coffee break"
				value={isAdd ? "" : task.title}
				required
			/>
		</fieldset>
		<fieldset>
			<legend>Description</legend>
			<textarea
				name="description"
				rows="4"
				placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
				>{isAdd ? "" : task.description}</textarea
			>
		</fieldset>
		<fieldset>
			<legend>Subtasks</legend>
			<div class="subtask-holder">
				{#each subtasks as s, i}
					<div class="subtask">
						<input
							name="subtasks"
							type="text"
							value={s.title}
							placeholder={["e.g. Make coffee", "e.g. Drink coffee & smile"][i % 2]}
						/>
						<button type="button" class="delete-subtask" on:click={() => removeSubtask(i)}>
							<span class="sr-only">Delete subtask</span>
						</button>
					</div>
				{/each}
			</div>
			<button type="button" class="add-subtask" on:click={addSubtask}>+ Add New Subtask</button>
		</fieldset>
		<fieldset>
			<legend>Status</legend>
			<div class="select-wrap">
				<select name="status">
					{#each columns.map((col) => col.name) as c}
						<option value={c}>{c}</option>
					{/each}
				</select>
			</div>
		</fieldset>
		<input type="submit" value={isAdd ? "Create Task" : "Save Changes"} />
	</form>
</div>

<style lang="scss">
	.subtask-holder {
		padding: 1px;
		max-height: 200px;
		overflow-y: auto;
	}

	.subtask {
		display: flex;
		margin-bottom: 12px;
	}
	.subtask:last-of-type {
		margin: 0;
	}

	.delete-subtask {
		--cross-url: url("/images/icon-cross.svg");
		display: block;
		background: none;
		border: none;
		padding: 0;
		padding-left: 10px;
		margin-left: 6px;
	}
	.delete-subtask::after {
		content: var(--cross-url);
	}
	:global(.hoverable) .delete-subtask:hover {
		--cross-url: url("/images/icon-cross-red.svg");
	}

	.sr-only {
		@extend %screen-reader-only;
	}

	.add-subtask,
	input[type="submit"] {
		@extend %body-L;
		width: 100%;
		border-radius: 20px;
		border: none;
		height: 40px;
		background: rgba(99, 95, 199, 0.1);
		font-weight: inherit;
		color: var(--main-purple);
		margin-top: 12px;
	}
	:global(.hoverable) .add-subtask:hover {
		background: rgba(99, 95, 199, 0.25);
	}
	:global(.dark) .add-subtask {
		background: white !important;
	}

	input[type="submit"] {
		margin-top: 24px;
		background: var(--main-purple);
		color: white;
		transition: opacity 0.3s;
	}
	:global(.hoverable) input[type="submit"]:hover {
		background: var(--main-purple-hover);
	}
	form:has(:invalid) input[type="submit"] {
		pointer-events: none;
		opacity: 0.3;
	}
</style>
