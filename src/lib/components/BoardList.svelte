<script>
	import { page } from "$app/stores";
</script>

<ul aria-label="ALL BOARDS ({$page.data.boards.length})">
	{#each $page.data.boards as board, i}
		<li class:active={i == 0}><span>{board.name}</span></li>
	{/each}
</ul>

<style lang="scss">
    ul {
		list-style: inside url("/images/icon-board.svg");
		padding: 0;
        margin-top: 54px;
	}
	ul::before {
		content: attr(aria-label);
        @extend %heading-4;
		margin-left: var(--left); //from parent
	}

	li {
        @extend %heading-3;
		border-radius: 0px 100px 100px 0px;
		width: minMaxSize(225px, 276px, 480px, 1440px);
		padding-left: var(--left); //from parent
		padding-right: 2ch;
		box-sizing: border-box;
		height: 48px;
		line-height: 48px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
    li:first-of-type {
        margin-top: 19px;
    }
	li.active {
		background: var(--main-purple);
		list-style-image: url("/images/icon-board-active.svg");
		color: white;
	}
    li span {
        margin-left: minMaxSize(5px, 9px, 768px, 1440px);
        //centers li text with marker
        position: relative;
        bottom: 2px;
    }
</style>
