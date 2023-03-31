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
    $: task = $page.data.boards[$mainStore.currentBoard].columns[columnId].tasks[taskId];
    
    let useOptimistic = false;
    const optimisticUI = task.subtasks.map((s)=>({isCompleted: s.isCompleted}));

    $: total = task.subtasks.length;
	$: completed = (useOptimistic ? optimisticUI : task.subtasks).filter((s) => s.isCompleted).length;

	const dropButtons = [
		{
			text: "Edit Task",
			func: () => {
				$dialogStore.VIEWTASK.close();
				mainStore.beforeActionModal("EDIT", [columnId, taskId]);
				$dialogStore.ADDEDITTASK.open();
			},
		},
		{
			text: "Delete Task",
			func: () => {
				console.log("Delete Task");
				/*
                $dialogStore.VIEWTASK.close();
				//mainStore.beforeActionModal("EDIT", [columnId, taskId]);
				$dialogStore.DELETETASKBOARD.open();
                */
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
		}, 1000);
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
		use:enhance={({ data }) => {

			return async ({ update }) => {
				await update({ reset: false });
                useOptimistic = false;
			};
		}}
	>
		<input type="hidden" name="taskInfo" value={[$mainStore.currentBoard, columnId, taskId]} />
		<fieldset class="subtasks">
			<legend>Subtasks ({completed} of {total})</legend>
			{#each task.subtasks as s, i}
				<label>
					<input type="checkbox" checked={s.isCompleted} name="isCompleted" value={s.title} on:change={()=>{optimisticUI[i].isCompleted = !optimisticUI[i].isCompleted; useOptimistic = true;}}/>
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
	.header,
	.subtasks {
		display: flex;
	}
	.header h2 {
		flex-grow: 1;
	}

	div :global(.open-dropdown) {
		margin-right: -17.5px;
	}

	p {
		@extend %body-L;
	}

	.subtasks {
		flex-direction: column;
	}
</style>
