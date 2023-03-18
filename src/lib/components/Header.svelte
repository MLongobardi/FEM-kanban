<script>
	import { page } from "$app/stores";
</script>

<header>
	<h1>{$page.data.boards[0].name}</h1>
</header>

<style lang="scss">
	header {
		grid-area: header;
		display: flex;
		align-items: center;
		height: minMaxSize(64px, 80px);
		border-bottom: solid 1px var(--lines-light)
	}
	:global(.large-tablet) header {
		height: minMaxSize(80px, 96px, 768px, 1440px);
	}
	:global(.dark) header {
		background: var(--dark-grey);
	}

	h1 {
		margin-left: 24px;
	}
</style>
