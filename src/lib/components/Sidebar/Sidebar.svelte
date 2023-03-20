<script>
	import { BoardList, DarkLightSwitch } from "$comps";
	import { mainStore, mediaStore } from "$stores";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}
</script>

{#if $mainStore.showSidebarOnBigScreen}
	<aside transition:reducedSlide|local={{ delay: 100, duration: 800, easing: quintOut, axis: "x" }}>
		<div class="top">
			<img class="logo" alt="kanban logo dark" src="/images/logo-{$mainStore.darkMode ? 'light' : 'dark'}.svg" />
			<BoardList />
		</div>
		<div class="bottom">
			<DarkLightSwitch />
			<button class="hide-sidebar" on:click={mainStore.toggleSidebar}>
				<span>Hide Sidebar</span>
			</button>
		</div>
	</aside>
{/if}

<style lang="scss">
	$verticalPadding: 32px;

	aside {
		--width: #{minMaxSize(243px, 300px, 480px, 1440px)};
		grid-area: side;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: var(--width);
		padding: $verticalPadding 0 $verticalPadding 0;
		box-sizing: border-box;
		border-right: solid 1px var(--lines-light);
		white-space: nowrap;
		height: 100%;
		--left: #{minMaxSize(24px, 32px, 768px, 1440px)};
		//position: relative;
		//z-index: 1;
	}
	:global(.dark) aside {
		background: var(--dark-grey);
		border-right: solid 1px var(--lines-dark);
	}

	.logo {
		margin-left: calc(2px + var(--left));
	}

	.hide-sidebar {
		@extend %strip;
		--icon-url: url("/images/icon-hide-sidebar.svg");
		--icon-url-hover: url("/images/icon-hide-sidebar-purple.svg");
		color: var(--medium-grey);
		margin-top: 8px;
	}
</style>
