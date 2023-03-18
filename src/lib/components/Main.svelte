<script>
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import { mainStore, mediaStore } from "$stores";
	import { fade, slide } from "svelte/transition";

	function reducedSlide(node, options) {
		if ($mediaStore.misc.prefersReducedMotion) return fade(node, {delay: 100, duration: 100});
		return slide(node, options);
	}

	const optimistic = {
		using: false,
		data: {},
	};

	function addEnhance({ data }) {
		optimistic.using = true;
		optimistic.data.addTest = data.get("addTest");

		return async ({ update }) => {
			await update();
			optimistic.using = false;
		};
	}

	function resetEnhance() {
		optimistic.using = true;
		optimistic.data = {};

		return async ({ update }) => {
			await update();
			optimistic.using = false;
		};
	}
</script>

<main>
	DB Test:

	<form method="POST" action="?/add" use:enhance={addEnhance}>
		testing ADD
		<input name="addTest" />
	</form>

	<form method="POST" action="?/reset" use:enhance={resetEnhance}>
		<input type="submit" name="resetTest" value="testing RESET" />
	</form>

	<p>data.addTest: {optimistic.using ? optimistic.data.addTest : $page.data.addTest}</p>
	<p>
		Above data is currently being read by: {optimistic.using
			? "component internal state"
			: "database"}
	</p>
	
	{#if $mediaStore.currentScreen != "mobile"}
		<!--double if so that the transition only works on the second condition, thanks to |local-->
		{#if !$mainStore.showSidebarOnBigScreen}
		<button class="show-sidebar" on:click={mainStore.toggleSidebar} transition:reducedSlide|local={{axis:"x", duration: 200, delay: 200}}>
			<img alt="show sidebar" src="/images/icon-show-sidebar.svg" />
		</button>
		{/if}
	{/if}
</main>

<style lang="scss">
	main {
		grid-area: main;
		text-align: center;
		background: var(--light-grey);
	}

	.show-sidebar {
		@extend %strip;
		width: 56px;
		position: absolute;
		bottom: 32px;
		background: var(--main-purple);
		padding: 0;
	}
	:global(.hoverable) .show-sidebar:hover {
		background: var(--main-purple-hover) !important;
	}
	.show-sidebar img {
		display: block;
		margin-left: 18px;
	}
</style>
