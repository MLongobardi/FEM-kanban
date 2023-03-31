<script>
	import { page } from "$app/stores";
	import { mainStore, mediaStore } from "$stores";
	import { TaskCard } from "$comps";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}
</script>

<main>
	{#if $page.data.boards[$mainStore.currentBoard].columns.length > 0}
		<div class="columns-holder">
			{#each $page.data.boards[$mainStore.currentBoard].columns as c, i}
				<section class="column">
					<h2 style:--dotColor={["#49C4E5", "#8471F2", "#67E2AE"][i]}>{c.name}</h2>
					{#each c.tasks as t, j}
						{@const total = t.subtasks.length}
						{@const completed = t.subtasks.filter((s) => s.isCompleted).length}
						<TaskCard colId={i} taskId={j} title={t.title} {completed} {total} />
					{:else}
						no tasks
					{/each}
				</section>
			{/each}
			<button class="column"><span>+ New Column</span></button>
		</div>
	{:else}
		NO TASKS<!--temp-->
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

	.column {
		width: 280px;
		flex-shrink: 0;
		margin-top: 24px;
		margin-left: 24px;
		display: flex; //prevents margins collapsing, so that the .task-card:active effect works
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

	button.column {
		--btn-color-var-1: var(--medium-grey);
		--btn-color-hov-1: var(--main-purple);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 63.12px; //24px + 24px + 12px * 1.26
		margin-right: 24px;
		border-radius: 6px;
		border: none;
		padding: 0;
		background: linear-gradient(180deg, #e9effa 0%, rgba(233, 239, 250, 0.5) 100%);
		color: var(--btn-color-var-1);

		:global(.dark) & {
			background: linear-gradient(180deg, rgba(43, 44, 55, 0.25) 0%, rgba(43, 44, 55, 0.125) 100%);
		}
	}
	button.column span {
		@extend %heading-1;
		color: inherit;
	}
</style>
