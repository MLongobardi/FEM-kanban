<script>
	import { page } from "$app/stores";
	import { dialogStore, mainStore, mediaStore } from "$stores";
	import { TaskCard } from "$comps";
	import { slide, crossfade, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";

	let main;

	function handleNewColumn() {
		mainStore.beforeActionModal("BOARD", "EDIT", true);
		$dialogStore.ADDEDITTASKBOARD.open();
	}

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;

			return {
				delay: 100,
				duration: 500,
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
	function reducedFlip(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return flip(node, options);
		return () => {return arguments};
	}
</script>

<main bind:this={main}>
	{#key $mainStore.currentBoard}
		{#if $page.data.boards[$mainStore.currentBoard].columns.length > 0}
			<div class="columns-holder" in:fade>
				{#each $page.data.boards[$mainStore.currentBoard].columns as c, i}
					<section class="column">
						<h2 style:--dotColor={["#49C4E5", "#8471F2", "#67E2AE"][i%3]}>
							{c.name} ({c.tasks.length})
						</h2>
						<div class="tasks">
							{#each c.tasks as t, j (t.title)}
								{@const total = t.subtasks.length}
								{@const completed = t.subtasks.filter((s) => s.isCompleted).length}
								<article
									class="task-holder"
									in:reducedReceive|local={{ key: t.title }}
									out:reducedSend|local={{ key: t.title }}
									animate:reducedFlip={{ easing: quintOut }}
								>
									<TaskCard colId={i} taskId={j} title={t.title} {completed} {total} {main} />
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
				<button
					on:click={handleNewColumn}>+ Add New Column</button
				>
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
		width: 280px;
		flex-shrink: 0;
		margin-top: 24px;
		margin-left: 24px;
		margin: 0 12px 0 12px;
		display: flex; //prevents margin collapsing, so that the .task-card:active effect works
		flex-direction: column;
	}
	.column h2 {
		@extend %heading-4;
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

	.tasks:not(:has(article)) {
		height: 100%;
		border-radius: 8px;
	}

	button.column {
		--btn-color-var-1: var(--medium-grey);
		--btn-color-hov-1: var(--main-purple);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 39.12px; //24px + 12px * 1.26
		margin-right: 24px;
		border-radius: 6px;
		border: none;
		padding: 0;
		color: var(--btn-color-var-1);
	}

	.tasks:not(:has(article)),
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
