<script>
	import { BoardList } from "$comps";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	let hidden = false;
</script>

{#if !hidden}
	<aside transition:slide|local={{ delay: 100, duration: 800, easing: quintOut, axis: "x" }}>
		<div class="top">
			<img alt="kanban logo dark" src="/images/logo-dark.svg" />
			<BoardList />
		</div>
		<div class="bottom">
			<span>dark light switch</span>
		</div>
	</aside>
{/if}

<button
	style="position: absolute; bottom: 0"
	on:click={() => {
		hidden = !hidden;
	}}>test Slide</button
>

<style lang="scss">
	aside {
		--width: #{minMaxSize(243px, 300px, 480px, 1440px)};
		grid-area: side;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: var(--width);
		padding: 32px 0 32px 0;
		box-sizing: border-box;
		border-right: solid 1px var(--lines-light);
		white-space: nowrap;
		height: 100%;
		--left: #{minMaxSize(24px, 32px, 768px, 1440px)};
	}

	img {
		margin-left: calc(2px + var(--left));
	}
</style>
