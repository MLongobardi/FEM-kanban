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
						<button type="button" class="delete-task" on:click={() => removeSubtask(i)}>
							<img alt="delete subtask" src="/images/icon-cross.svg" />
						</button>
					</div>
				{/each}
			</div>
			<button type="button" class="add-subtask" on:click={addSubtask}>+ Add New Subtask</button>
		</fieldset>
		<fieldset>
			<legend>Status</legend>
			<select name="status">
				{#each columns.map((col) => col.name) as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
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

	.delete-task {
		display: block;
		background: none;
		border: none;
	}

	.add-subtask,
	input[type="submit"] {
		width: 100%;
		border-radius: 20px;
		border: none;
		height: 40px;
		font-weight: inherit;
		background: rgba(99, 95, 199, 0.1);
		color: var(--main-purple);
		margin-top: 12px;
	}
	input[type="submit"] {
		margin-top: 24px;
		background: var(--main-purple);
		color: white;
	}
</style>
