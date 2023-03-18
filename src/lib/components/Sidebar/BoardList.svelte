<script>
	import { page } from "$app/stores";
</script>

<section>
	<h4>ALL BOARDS ({$page.data.boards.length})</h4>
	{#each $page.data.boards as board, i}
		{@const active = i == 0}
		<button class="board" class:active disabled={active}>
			<span>{board.name}</span>
		</button>
	{/each}
	<button class="add">
		<span>+ Create New Board</span>
	</button>
</section>

<style lang="scss">
	section {
		margin-top: 54px;
	}

	h4 {
		margin: 0 0 19px minMaxSize(24px, 32px, 768px, 1440px);
	}

	.board {
		@extend %strip;
		--icon-url: url("/images/icon-board.svg");
		--icon-url-hover: url("/images/icon-board-purple.svg");
		--icon-url-active: url("/images/icon-board-white.svg");
	}

	.add {
		@extend %strip;
		--icon-url: url("/images/icon-board-purple.svg");
		color: var(--main-purple);
	}
</style>
