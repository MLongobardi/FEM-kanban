<script>
	import { page } from "$app/stores";
	import { dialogStore, mainStore, mediaStore } from "$stores";
	import { TaskCard } from "$comps";
	import { debounce } from "$scripts";
	import { slide, crossfade, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";

	let main;
	//$:console.log($mainStore.dragged?.oldInfo?.taskId,"->", $mainStore.dragged?.newInfo?.taskId)

	$: optimisticColumns = $page.data.boards[$mainStore.currentBoard].columns.map((c, colId) => ({
		name: c.name,
		tasks: optimisticTasks(colId, c.tasks),
	}));

	function optimisticTasks(colTarget, tasks) {
		if ($mainStore.dragInProgress) {
			return injectDraggedTask(colTarget, tasks);
		} else if ($mainStore.dragIsPending) {
			/*backend hasn't finished processing request*/
			let answer = tasks;
			let oldInfo = $mainStore.dragged.oldInfo;
			let newInfo = $mainStore.dragged.newInfo;
			if (oldInfo.colId == colTarget) {
				answer = [...answer.slice(0, oldInfo.taskId), ...answer.slice(oldInfo.taskId + 1)];
			}
			if (newInfo.colId == colTarget) {
				let draggedTask =
					$page.data.boards[$mainStore.currentBoard].columns[oldInfo.colId].tasks[oldInfo.taskId];
				let newId = newInfo.taskId;
				if (oldInfo.colId == newInfo.colId) {
					newId--;
				}

				answer = [...answer.slice(0, newId), draggedTask, ...answer.slice(newId)];
			}
			return answer;
		}
		return tasks; //if no drag is in progress/pending, or if drag is pending but colTarget isn't affected
	}

	function injectDraggedTask(colTarget, tasks) {
		if (!$mainStore.dragInProgress) return tasks;
		let oldInfo = $mainStore.dragged.oldInfo;
		let newInfo = $mainStore.dragged.newInfo;
		if (oldInfo.colId == newInfo.colId && oldInfo.taskId == newInfo.taskId) return tasks;
		if (oldInfo.colId == colTarget)
			tasks = tasks.map((t, i) => {
				if (i == oldInfo.taskId) return { ...{ ghost: true }, ...t };
				return t;
			});
		if (newInfo.colId == null || newInfo.taskId == null || colTarget != newInfo.colId) return tasks;
		let task =
			$page.data.boards[$mainStore.currentBoard].columns[oldInfo.colId].tasks[oldInfo.taskId];
		let tempTask = {
			temporary: true,
			title: task.title + "\u200a".repeat(colTarget + 1), //title is used as key for #each block
			description: task.description,
			status: task.status,
			subtasks: task.subtasks,
		};

		return [...tasks.slice(0, newInfo.taskId), tempTask, ...tasks.slice(newInfo.taskId)];
	}

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
				delay: $mainStore.dragIsPending ? 5 : 150,
				duration: $mainStore.dragIsPending ? 5 : 500,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
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

	let debouncedUpdateDrag = debounce((i, j) => {
		if ($mainStore.dragged.oldInfo.colId == i) {
			let oldJ = $mainStore.dragged.oldInfo.taskId;
			if (oldJ == j) j++;
			console.log(j, optimisticColumns[i].tasks.length);
			//else if (j == optimisticColumns[i].tasks.length+1) j--;
			//else j--;
		}
		mainStore.updateDrag({ colId: i, taskId: j });
	}, 50);
</script>

<main bind:this={main}>
	{#key $mainStore.currentBoard}
		{#if $page.data.boards[$mainStore.currentBoard].columns.length > 0}
			<div class="columns-holder" in:fade>
				{#each optimisticColumns as c, i}
					<section class="column">
						<h2 style:--dotColor={["#49C4E5", "#8471F2", "#67E2AE"][i % 3]}>
							{c.name} ({c.tasks.filter((t) => !t?.ghost).length})
						</h2>
						<!-- svelte-ignore a11y-mouse-events-have-key-events -->
						<div
							class="tasks"
							on:mouseover|self={$mainStore.dragInProgress
								? () => {
										debouncedUpdateDrag.deb(i, c.tasks.length);
								  }
								: null}
						>
							{#each c.tasks as t, j (t.title)}
								{@const total = t.subtasks.length}
								{@const completed = t.subtasks.filter((s) => s.isCompleted).length}
								<!-- svelte-ignore a11y-mouse-events-have-key-events -->
								<article
									class:ghost={t?.ghost}
									on:mouseover={$mainStore.dragInProgress
										? () => {
												debouncedUpdateDrag.deb(i, j);
										  }
										: null}
									in:reducedReceive|local={{ key: t.title }}
									out:reducedSend|local={{ key: t.title }}
									animate:reducedFlip={{
										easing: quintOut,
										duration: (d) => Math.sqrt(d) * ($mainStore.dragInProgress ? 15 : 200),
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

	.tasks {
		display: flex; //prevents margin collapsing, so that the .task-card:active effect works
		flex-direction: column;
		box-sizing: border-box;
		width: 304px;
		height: 100%;
	}
	.tasks:not(:has(article)) {
		width: 280px;
		margin: 0 12px;
		border-radius: 8px;
		border: 2px solid var(--lines-color);
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

	/*.tasks:not(:has(article)),*/
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

	article {
		width: 280px;
		padding: 0 12px;
	}
	article.ghost {
		//height: 0px;
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
