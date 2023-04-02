<script>
	import { Select } from "$comps";
	import { dialogStore, mainStore } from "$stores";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";

	let iterables, iterName, capitalIterName, board, task, columnId, taskId, selectOptions;
	let isTask = $mainStore.currentActionTarget == "TASK";
	let isAdd = $mainStore.currentActionType == "ADD";

	if (isTask) {
		iterName = "subtask";
		capitalIterName = "Subtask";
		selectOptions = $page.data.boards[$mainStore.currentBoard].columns.map((col) => ({
			value: col.name,
			label: col.name,
		}));
		if (isAdd) {
			//Add Task
			iterables = [
				{ title: "", isCompleted: false },
				{ title: "", isCompleted: false },
			];
		} else {
			//Edit Task
			columnId = $mainStore.currentTaskInEdit.columnId;
			taskId = $mainStore.currentTaskInEdit.taskId;
			task = $page.data.boards[$mainStore.currentBoard].columns[columnId].tasks[taskId];
			if (task.subtasks.length >= 1) iterables = task.subtasks;
		}
	} else {
		iterName = "column";
		capitalIterName = "Column";
		if (isAdd) {
			//Add Board
			iterables = [
				{ name: "Todo", tasks: [] },
				{ name: "Doing", tasks: [] },
			];
		} else {
			//Edit Board
			board = $page.data.boards[$mainStore.currentBoard];
			iterables = board.columns;
		}
	}

	function addIter() {
		let newIter = { title: "", isCompleted: false };
		if (!isTask) newIter = { name: "", tasks: [] };
		iterables = [...iterables, newIter];
	}
	function removeIter(id) {
		iterables = [...iterables.slice(0, id), ...iterables.slice(id + 1)];
	}
</script>

<div>
	<h2>{isAdd ? "Add New" : "Edit"} {isTask ? "Task" : "Board"}</h2>
	<form
		method="POST"
		action={(isAdd ? "?/add" : "?/edit") + (isTask ? "Task" : "Board")}
		use:enhance={() => {
			return async ({ update }) => {
				await update();
                if (!isTask && isAdd) mainStore.setBoard($page.data.boards.length - 1);
				$dialogStore.ADDEDITTASKBOARD.close();
			};
		}}
	>
		{#if isTask}
			<input
				type="hidden"
				name="taskInfo"
				value={[$mainStore.currentBoard].concat(isAdd ? [] : [columnId, taskId])}
			/>
		{:else}
			<input type="hidden" name="boardId" value={$mainStore.currentBoard} />
		{/if}
		<fieldset>
			{#if isTask}
				<legend>Title</legend>
				<input
					type="text"
					name="title"
					placeholder="e.g. Take coffee break"
					value={isAdd ? "" : task.title}
					required
				/>
			{:else}
				<!--isBoard-->
				<legend>Name</legend>
				<input
					type="text"
					name="name"
					placeholder="e.g. Web Design"
					value={isAdd ? "" : board.name}
					required
				/>
			{/if}
		</fieldset>
		{#if isTask}
			<fieldset>
				<legend>Description</legend>
				<textarea
					name="description"
					rows="4"
					placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
					>{isAdd ? "" : task.description}</textarea
				>
			</fieldset>
		{/if}
		<fieldset>
			<legend>{capitalIterName}s</legend>
			<div class="{iterName}-holder">
				{#each iterables as iter, i}
					{@const placeholders = isTask
						? ["e.g. Make coffee", "e.g. Drink coffee & smile"]
						: ["Todo", "Doing"]}
					<div class={iterName}>
						<input
							name="{iterName}s"
							type="text"
							value={isTask ? iter.title : iter.name}
							placeholder={placeholders[i % placeholders.length]}
						/>
						<button type="button" class="delete-{iterName}" on:click={() => removeIter(i)}>
							<span class="sr-only">Delete {iterName}</span>
						</button>
					</div>
				{/each}
			</div>
			<button type="button" class="add-{iterName}" on:click={addIter}
				>+ Add New {capitalIterName}</button
			>
		</fieldset>
		{#if isTask}
			<fieldset>
				<legend>Status</legend>
				<Select
					name="status"
					options={selectOptions}
					initial={isAdd ? 0 : columnId}
					chevron={false}
				/>
			</fieldset>
		{/if}
		<input
			type="submit"
			value={isAdd ? "Create " + (isTask ? "Task" : "New Board") : "Save Changes"}
		/>
	</form>
</div>

<style lang="scss">
	:is(.subtask-holder, .column-holder) {
		--max-lines: 3;
		padding: 1px;
		max-height: calc(48px * var(--max-lines));
		overflow-y: auto;
	}

	:is(.subtask, .column) {
		display: flex;
		margin-bottom: 12px;

		&:last-of-type {
			margin: 0;
		}
	}

	:is(.delete-subtask, .delete-column) {
		--btn-color-var-1: url("/images/icon-cross.svg");
		--btn-color-hov-1: url("/images/icon-cross-red.svg");
		--cross-url: var(--btn-color-var-1);
		display: block;
		background: none;
		border: none;
		padding: 0;
		padding-left: 10px;
		margin-left: 6px;

		&::after {
			content: var(--cross-url);
		}
	}

	.sr-only {
		@extend %screen-reader-only;
	}

	:is(.add-subtask, .add-column),
	input[type="submit"] {
		--btn-color-var-1: rgba(99, 95, 199, 0.1);
		--btn-color-hov-1: rgba(99, 95, 199, 0.25);
		@extend %body-L;
		width: 100%;
		border-radius: 20px;
		border: none;
		height: 40px;
		background: var(--btn-color-var-1);
		font-weight: inherit;
		color: var(--main-purple);
		margin-top: 12px;
	}
	:global(.dark) :is(.add-subtask, .add-column) {
		--btn-color-var-1: white;
		--btn-color-hov-1: white;
	}

	input[type="submit"] {
		--btn-color-var-1: var(--main-purple);
		--btn-color-hov-1: var(--main-purple-hover);
		margin-top: 24px;
		color: white;
		transition: opacity 0.3s;
	}
	form:has(:invalid) input[type="submit"] {
		pointer-events: none;
		opacity: 0.3;

		:global(.hoverable) & {
			cursor: not-allowed;
		}
	}
</style>
