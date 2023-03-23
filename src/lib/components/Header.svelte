<script>
	import { page } from "$app/stores";
	import { mainStore, mediaStore, dialogStore } from "$stores";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	let showDropdown = false;

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}

	function handlePointerUp(e) {
		if (!showDropdown) document.removeEventListener("pointerup", handlePointerUp);
		if (!e.target.matches(":is(.header-dropdown, .open-menu, .open-menu *)")) {
			showDropdown = false;
			document.removeEventListener("pointerup", handlePointerUp);
		}
	}
	
	function openDropDown() {
		if (showDropdown) return;
		showDropdown = true;
		document.addEventListener("pointerup", handlePointerUp);
	}
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
				<img alt="Open mobile sidebar" src="/images/icon-chevron-down.svg"/>
			</button>
		{/if}
	</div>
	<div class="right">
		<button class="new-task" on:click={$dialogStore.ADDEDITTASK.open}>
			{#if $mediaStore.currentScreen == "mobile"}
				<img alt="add task" src="/images/icon-add-task-mobile.svg" />
			{:else}
				+ Add New Task
			{/if}
		</button>
		<button class="open-menu" on:click={openDropDown}>
			<img alt="Open this board menu" src="/images/icon-vertical-ellipsis.svg" />
		</button>
		{#if showDropdown}
			<div class="header-dropdown">
				<button class="edit">Edit board</button>
				<button class="delete">Delete board</button>
			</div>
		{/if}
	</div>
</header>

<style lang="scss">
	header {
		grid-area: header;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: minMaxSize(64px, 80px);
		border-bottom: solid 1px var(--lines-light);
	}
	:global(.large-tablet) header {
		height: minMaxSize(80px, 96px, 768px, 1440px);
	}
	:global(.dark) header {
		background: var(--dark-grey);
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
		//padding-left: 24px;
		box-sizing: border-box;
		width: 205px;
		height: 100%;
		border-right: solid 1px var(--lines-light);
	}
	:global(.dark) .logo-holder {
		border-right: solid 1px var(--lines-dark);
	}

	.logo-holder img, .left > img {
		margin-left: minMaxSize(16px, 24px);
	}

	h1 {
		margin-left: 24px;
	}

	.new-task {
		@extend %heading-3;
		--horizontal-padding: #{minMaxSize(18px, 25px)};
		//padding: 0 var(--horizontal-padding);
		min-width: minMaxSize(140px, 164px, 550px, 768px);
		background: var(--main-purple);
		color: white;
		border: none;
		border-radius: 24px;
		height: minMaxSize(32px, 48px);
	}
	:global(.hoverable) .new-task:hover {
		background: var(--main-purple-hover);
	}
	.new-task:has(img) {
		min-width: 48px;
	}

	.open-menu {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		padding: 0;
		margin: 0 minMaxSize(1px, 9px);
		background: none;
		border: none;
	}
	:global(.hoverable) .open-menu:hover {
		background: var(--lines-light);
	}
	:global(.dark.hoverable) .open-menu:hover {
		background: var(--lines-dark);
	}

	.header-dropdown {
		@extend %dropdown;
		width: 192px;
		height: 94px;
		position: absolute;
		top: 100px;
	}
</style>
