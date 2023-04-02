<script>
	import { page } from "$app/stores";
	import { mainStore, mediaStore, dialogStore } from "$stores";
	import { Dropdown } from "$comps";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}

	function handleNewTask() {
		mainStore.beforeActionModal("TASK","ADD");
		$dialogStore.ADDEDITTASKBOARD.open();
	}

	const dropButtons = [
		{
			text: "Edit Board",
			func: () => {
				mainStore.beforeActionModal("BOARD","EDIT");
				$dialogStore.ADDEDITTASKBOARD.open();
			},
		},
		{
			text: "Delete Board",
			func: () => {
				mainStore.beforeActionModal("BOARD","DELETE");
				$dialogStore.DELETETASKBOARD.open();
			},
		},
	];
</script>

<header>
	<div class="left">
		{#if $mediaStore.currentScreen != "mobile"}
			{#if !$mainStore.showSidebarOnBigScreen}
				<div
					class="logo-holder"
					transition:reducedSlide|local={{ delay: 100, duration: 800, easing: quintOut, axis: "x" }}
				>
					<img alt="logo kanban" src="/images/logo-{$mainStore.darkMode ? 'light' : 'dark'}.svg" />
				</div>
			{/if}
		{:else}
			<img alt="logo kanban" src="/images/logo-mobile.svg" />
		{/if}
		<h1>{$page.data.boards[$mainStore.currentBoard].name}</h1>
		{#if $mediaStore.currentScreen == "mobile"}
			<button on:click={$dialogStore.MOBILESIDEBAR.open}>
				<img alt="Open mobile sidebar" src="/images/icon-chevron-down.svg" />
			</button>
		{/if}
	</div>
	<div class="right">
		<button class="new-task" on:click={handleNewTask}>
			{#if $mediaStore.currentScreen == "mobile"}
				<img alt="add task" src="/images/icon-add-task-mobile.svg" />
			{:else}
				+ Add New Task
			{/if}
		</button>
		<Dropdown {dropButtons}>
			<img class="open-menu" alt="Open this board menu" src="/images/icon-vertical-ellipsis.svg" />
		</Dropdown>
	</div>
</header>

<style lang="scss">
	header {
		position: relative; //anchor for dropdown
		grid-area: header;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: minMaxSize(64px, 80px);
		border-bottom: solid 1px var(--lines-color);
		background: var(--background-color);
	}
	:global(.large-tablet) header {
		height: minMaxSize(80px, 96px, 768px, 1440px);
	}

	.left,
	.right {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.logo-holder {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 205px;
		height: 100%;
		border-right: solid 1px var(--lines-color);
	}

	.logo-holder img,
	.left > img {
		margin-left: minMaxSize(16px, 24px);
	}

	h1 {
		margin-left: 24px;
	}

	.new-task {
		@extend %heading-3;
		--btn-color-var-1: var(--main-purple);
		--btn-color-hov-1: var(--main-purple-hover);
		min-width: minMaxSize(140px, 164px, 550px, 768px);
		background: var(--btn-color-var-1);
		color: white;
		border: none;
		border-radius: 24px;
		height: minMaxSize(32px, 48px);
	}
	.new-task:has(img) {
		min-width: 48px;
	}

	.right :global(.open-dropdown) {
		margin: 0 minMaxSize(1px, 9px);
	}

	.right :global(.dropdown-holder) {
		position: static;
	}
	.right :global(.dropdown) {
		--offset: -6px;
		left: unset;
		right: 24px;
	}
</style>
