<script>
	import { page } from "$app/stores";
	import { dialogStore, mainStore, mediaStore } from "$stores";
	import { TaskCard } from "$comps";
	import { debounce } from "$scripts";
	import { slide, crossfade, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";

	let main;

	$: optimisticColumns = $page.data.boards[$mainStore.currentBoard].columns.map((c, colId) => ({
		name: c.name,
		tasks: optimisticTasks(colId, c.tasks),
	}));

	let lastCalculated = new Map();

	function optimisticTasks(colTarget, tasks) {
		//const colKey = "\u200a".repeat(colTarget + 1); //task title is used as key for #each block
		const colKey = "d"+"*".repeat(colTarget + 1); //test
		if ($mainStore.dragInProgress) {
			return injectDraggedTask(colTarget, tasks, colKey);
		} else if ($mainStore.dragIsPending) {
			/*backend hasn't finished processing request*/
			if ($mainStore.freezeDrag) return lastCalculated.get(colTarget); //invalidateAll is executing
			let answer = tasks;
			let oldInfo = $mainStore.dragged.oldInfo;
			let newInfo = $mainStore.dragged.newInfo;
			if (oldInfo.colId == colTarget) {
				//task was dragged from colTarget
				answer = [...answer.slice(0, oldInfo.taskId), ...answer.slice(oldInfo.taskId + 1)];
			}
			if (newInfo.colId == colTarget) {
				//task was dropped in colTarget
				let task =
					$page.data.boards[$mainStore.currentBoard].columns[oldInfo.colId].tasks[oldInfo.taskId];
				let draggedTask = {
					//title: task.title.trim() + colKey, //test
					//title: task.title + colKey,
					title: task.title,
					id: task.id + colKey,
					description: task.description,
					status: task.status,
					subtasks: task.subtasks,
				};
				let newId = newInfo.taskId;
				if (oldInfo.colId == newInfo.colId && newInfo.taskId > oldInfo.taskId) {
					newId--;
				}

				answer = [...answer.slice(0, newId), draggedTask, ...answer.slice(newId)];
			}
			lastCalculated.set(colTarget, answer);
			return answer;
		}
		return tasks;
	}

	function injectDraggedTask(colTarget, tasks, colKey) {
		if (!$mainStore.dragInProgress) return tasks;
		let oldInfo = $mainStore.dragged.oldInfo;
		let newInfo = $mainStore.dragged.newInfo;

		//don't inject task where the ghost is
		if (oldInfo.colId == newInfo.colId && oldInfo.taskId == newInfo.taskId) return tasks;
		//if task was taken from colTarget, apply ghost tag to it
		//this way, the column title doesn't count both the ghost and the temporary task
		if (oldInfo.colId == colTarget) {
			tasks = tasks.map((t, i) => {
				if (i == oldInfo.taskId) return { ...{ ghost: true }, ...t };
				return t;
			});
		}
		//if newTask info is invalid, or I am not hovering colTarget, don't inject task
		if (newInfo.colId == null || newInfo.taskId == null || colTarget != newInfo.colId) return tasks;

		//create temporary task
		let task =
			$page.data.boards[$mainStore.currentBoard].columns[oldInfo.colId].tasks[oldInfo.taskId];
		let tempTask = {
			temporary: true,
			//title: task.title.trim() + colKey, //test
			//title: task.title + colKey,
			title: task.title,
			id: task.id + colKey,
			description: task.description,
			status: task.status,
			subtasks: task.subtasks,
		};

		//inject temporary task
		return [...tasks.slice(0, newInfo.taskId), tempTask, ...tasks.slice(newInfo.taskId)];
	}

	let debouncedUpdateDrag = debounce((i, j) => {
		j = Math.min(j, $page.data.boards[$mainStore.currentBoard].columns[i].tasks.length);
		mainStore.updateDrag({ colId: i, taskId: j });
	}, 50);

	function handleNewColumn() {
		mainStore.beforeActionModal("BOARD", "EDIT", true);
		$dialogStore.ADDEDITTASKBOARD.open();
	}

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d) * ($mainStore.dragIsPending ? 0 : 40),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;

			return {
				delay: $mainStore.dragIsPending ? 0 : 150,
				duration: $mainStore.dragIsPending ? 0 : 500,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t};
					pointer-events: none;
				`,
			};
		},
	});

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}
	function reducedSend(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return send(node, options);
	}
	function reducedReceive(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return receive(node, options);
	}
	function reducedFlip(node, fromTo, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return flip(node, fromTo, options);
		return {};
	}
</script>

<main
	bind:this={main}
	on:mouseleave={$mainStore.dragInProgress
		? () => {
				mainStore.updateDrag($mainStore.dragged.oldInfo);
		  }
		: null}
>
	{#key $mainStore.currentBoard}
		{#if $page.data.boards[$mainStore.currentBoard].columns.length > 0}
			<div class="columns-holder" in:fade>
				{#each optimisticColumns as c, i}
					<section class="column">
						<h2 style:--dotColor={["#49C4E5", "#8471F2", "#67E2AE"][i % 3]}>
							{c.name} ({c.tasks.filter((t) => !t?.ghost).length})
						</h2>
						<div class="tasks">
							{#each c.tasks as t, j (t.id)} <!--(t.title)-->
								{@const total = t.subtasks.length}
								{@const completed = t.subtasks.filter((s) => s.isCompleted).length}
								<article
									on:mouseenter={$mainStore.dragInProgress
										? () => {
												debouncedUpdateDrag.deb(i, j);
										  }
										: null}
									in:reducedReceive|local={{ key: t.id /*t.title*/ }}
									out:reducedSend|local={{ key: t.id /*t.title*/ }}
									animate:reducedFlip={{
										easing: quintOut,
										duration: (d) => Math.sqrt(d) * ($mainStore.dragInProgress ? 20 : 200),
									}}
								>
									<TaskCard
										colId={i}
										taskId={j}
										title={t.title}
										{completed}
										{total}
										{main}
										temporary={t?.temporary}
									/>
								</article>
							{/each}
							{#if $mainStore.dragInProgress}
								<span
									class="catch-drag"
									on:mouseenter={() => {
										debouncedUpdateDrag.deb(i, c.tasks.length);
									}}
								/>
							{/if}
						</div>
					</section>
				{/each}
				<button class="column" on:click={handleNewColumn}><span>+ New Column</span></button>
			</div>
		{:else}
			<div class="empty-board">
				<h2>This board is empty. Create a new column to get started.</h2>
				<button on:click={handleNewColumn}>+ Add New Column</button>
			</div>
		{/if}

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
	{/key}
</main>

<style lang="scss">
	main {
		grid-area: main;
		display: flex;
		background: var(--light-grey);
		overflow: auto;
	}
	:global(.dark) main {
		background: var(--very-dark-grey);
	}

	.columns-holder {
		display: flex;
		height: max-content;
		min-height: 87%;
		padding-top: 24px;
		padding-left: 12px;
	}

	.column {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
	}
	.column h2 {
		@extend %heading-4;
		padding: 0 12px;
		display: inline-flex;
		margin-bottom: 24px;

		&::before {
			content: "";
			display: inline-block;
			height: 100%;
			width: 15px;
			background: var(--dotColor);
			border-radius: 50%;
			margin-right: 12px;
		}
	}

	button.column {
		--btn-color-var-1: var(--medium-grey);
		--btn-color-hov-1: var(--main-purple);
		display: flex;
		width: 280px;
		justify-content: center;
		align-items: center;
		margin: 39.12px 24px 0 12px; //top is 24px + 12px * 1.26
		border-radius: 6px;
		border: none;
		padding: 0;
		color: var(--btn-color-var-1);
	}

	button.column {
		background: linear-gradient(180deg, #e9effa 0%, rgba(233, 239, 250, 0.5) 100%);
		:global(.dark) & {
			background: linear-gradient(180deg, rgba(43, 44, 55, 0.25) 0%, rgba(43, 44, 55, 0.125) 100%);
		}
	}

	button.column span {
		@extend %heading-1;
		color: inherit;
	}

	.tasks {
		display: flex; //prevents margin collapsing, so that the .task-card:active effect works
		flex-direction: column;
		box-sizing: border-box;
		margin: 0 12px;
		width: 280px;
		height: 100%;
		gap: 16px;
		transition: none;
	}
	.tasks:not(:has(article)) {
		border-radius: 8px;
		border: 2px solid var(--lines-color);
	}
	.tasks .catch-drag {
		flex-grow: 1;
	}

	.show-sidebar {
		--btn-color-var-1: var(--main-purple);
		--btn-color-hov-1: var(--main-purple-hover);
		display: block;
		border: none;
		border-radius: 0px 100px 100px 0px;
		height: 48px;
		width: 56px;
		position: absolute;
		bottom: 32px;
		background: var(--btn-color-var-1);
		padding: 0;
	}
	.show-sidebar img {
		display: block;
		margin: auto;
	}

	.empty-board {
		text-align: center;
		align-self: center;
		width: max-content;
		margin: auto;
	}
	.empty-board h2 {
		color: var(--medium-grey);
		margin: 0 16px;
	}
	.empty-board button {
		@extend %add-new-button;
		width: 174px;
		height: 48px;
		margin-top: minMaxSize(24px, 32px, 768px, 1440px);
	}
</style>
