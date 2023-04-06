<script>
	import { Dropdown, Select } from "$comps";
	import { dialogStore, mainStore } from "$stores";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import { onMount, onDestroy } from "svelte";
	import { debounce } from "$scripts";

	let form;

	let columnId = $mainStore.currentTaskInEdit.columnId;
	let taskId = $mainStore.currentTaskInEdit.taskId;
	let task = $page.data.boards[$mainStore.currentBoard].columns[columnId].tasks[taskId];

	let useOptimistic = false;
	let optimisticUI = task.subtasks.map((s) => ({ isCompleted: s.isCompleted }));

	$: total = task.subtasks.length;
	$: completed = (useOptimistic ? optimisticUI : task.subtasks).filter((s) => s.isCompleted).length;

	const dropButtons = [
		{
			text: "Edit Task",
			func: () => {
				$dialogStore.VIEWTASK.close();
				mainStore.beforeActionModal("TASK", "EDIT", [columnId, taskId]);
				$dialogStore.ADDEDITTASKBOARD.open();
			},
		},
		{
			text: "Delete Task",
			func: () => {
				$dialogStore.VIEWTASK.close();
				mainStore.beforeActionModal("TASK", "DELETE", [columnId, taskId]);
				$dialogStore.DELETETASKBOARD.open();
			},
		},
	];

	let debouncedSubmit = {
		deb: (f) => {
			f.requestSubmit();
		},
	};
	onMount(() => {
		debouncedSubmit = debounce((f) => {
			f.requestSubmit();
		}, 600);
	});
	onDestroy(() => {
		debouncedSubmit.skip(form);
	});
</script>

<div>
	<div class="header">
		<h2>{task.title}</h2>
		<Dropdown {dropButtons}>
			<img class="open-menu" alt="Open this task menu" src="/images/icon-vertical-ellipsis.svg" />
		</Dropdown>
	</div>
	<p>{task.description}</p>

	<form
		bind:this={form}
		method="POST"
		action="?/editTaskInView"
		data-sveltekit-keepfocus
		on:change={function () {
			debouncedSubmit.deb(this);
		}}
		use:enhance={() => {
			return async ({ data, update }) => {
				await update({ reset: false });
				if (data.get("status") != task.status) {
					columnId = $page.data.boards[$mainStore.currentBoard].columns.findIndex(
						(col) => col.name == data.get("status")
					);
					taskId = $page.data.boards[$mainStore.currentBoard].columns[columnId].tasks.findIndex(
						(t) => t.title == task.title
					);
				}
				if (form) {
					task = $page.data.boards[$mainStore.currentBoard].columns[columnId].tasks[taskId];
					optimisticUI = task.subtasks.map((s) => ({ isCompleted: s.isCompleted }));
					useOptimistic = false;
				}
			};
		}}
	>
		<input type="hidden" name="taskInfo" value={[$mainStore.currentBoard, columnId, taskId]} />
		<fieldset class="subtasks">
			<legend>Subtasks ({completed} of {total})</legend>
			{#each task.subtasks as s, i}
				<label>
					<input
						type="checkbox"
						checked={s.isCompleted}
						name="isCompleted"
						value={s.title}
						on:change={() => {
							optimisticUI[i].isCompleted = !optimisticUI[i].isCompleted;
							useOptimistic = true;
						}}
					/>
					{s.title}
				</label>
			{/each}
		</fieldset>
		<fieldset>
			<legend>Current Status:</legend>
			<Select
				name="status"
				options={$page.data.boards[$mainStore.currentBoard].columns.map((col) => ({
					value: col.name,
					label: col.name,
				}))}
				initial={columnId}
				chevron={false}
			/>
		</fieldset>
	</form>
</div>

<style lang="scss">
	.header {
		display: flex;
		align-items: center;
	}
	.header h2 {
		flex-grow: 1;
	}

	div :global(.dropdown-holder) {
		margin-right: -17.5px;
	}

	p {
		@extend %body-L;
		color: var(--medium-grey);
		margin: 24px 0;
		white-space: pre-line;
	}

	.subtasks {
		display: flex;
		flex-direction: column;
	}
	.subtasks legend {
		margin-bottom: 16px;
	}

	input {
		position: absolute;
		opacity: 0;
	}

	label {
		display: flex;
		align-items: center;
		background: var(--light-grey);
		border-radius: 4px;
		padding: 12px;
		margin-bottom: 8px;
		color: var(--black);

		:global(.dark) & {
			color: white;
		}
	}
	label:has(input:checked) {
		text-decoration: line-through;
		color: rgba(0, 1, 18, 0.5);

		:global(.dark) & {
			color: rgba(225, 225, 225, 0.5);
		}
	}
	label::before {
		position: relative;
		z-index: 1; //cover real checkbox
		content: "";
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 2px;
		width: 16px;
		height: 16px;
		margin-right: 16px;
		flex-shrink: 0;
		box-sizing: border-box;
		border: solid 1px rgba(130, 143, 163, 0.248914);
		background: white;

		:global(.dark) & {
			background: var(--dark-grey);
		}
	}
	label:has(input:focus-visible)::before {
		outline: auto;
	}
	label:has(input:checked)::before {
		content: url("/images/icon-check.svg");
		border: none;
		background: var(--main-purple);
	}
	label:last-of-type {
		margin: 0;
	}
	:global(.dark) label {
		background: var(--very-dark-grey);
	}
	:global(.hoverable) label:hover {
		background: rgba(99, 95, 199, 0.25);
	}
</style>
