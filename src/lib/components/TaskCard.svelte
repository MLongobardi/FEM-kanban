<script>
	import { dialogStore, mainStore } from "$stores";
	import { spring } from "svelte/motion";
	import { derived } from "svelte/store";
	export let colId, taskId, title, completed, total, main;
	let button,
		article,
		timeStart,
		timeout,
		mainBoundingRect,
		dragging = false,
		clientX = 0,
		clientY = 0,
		offsetX = 0,
		offsetY = 0,
		initialScrollX = 0,
		initialScrollY = 0,
		scrolledX = 0,
		scrolledY = 0,
		baseX = 0,
		baseY = 0,
		boundOffset = 2,
		delay = 120;

	let coords = spring(
		{ l: 0, t: 0 },
		{
			stiffness: 0.1,
			damping: 0.27,
			precision: 0.1,
		}
	);
	

	let boundCoords = derived(coords, ($c) => {
		let bl = $c.l - offsetX + baseX - scrolledX;
		let bt = $c.t - offsetY + baseY - scrolledY;
		if (article) {
			bl = Math.max(bl, mainBoundingRect.left + boundOffset);
			bl = Math.min(bl, mainBoundingRect.right - article.offsetWidth - boundOffset);
			bt = Math.max(bt, mainBoundingRect.top + boundOffset);
			bt = Math.min(bt, mainBoundingRect.bottom - article.offsetHeight - boundOffset);
		}

		return { l: bl + offsetX - baseX + scrolledX, t: bt + offsetY - baseY + scrolledY };
	});

	function redirectClick(e) {
		if (e.target != button) button.click();
	}

	function handleClick() {
		mainStore.beforeActionModal("VIEW", [colId, taskId]);
		$dialogStore.VIEWTASK.open();
	}

	function handleDrag(e) {
		clientX = e.clientX;
		clientY = e.clientY;
		coords.set({ l: clientX - baseX +scrolledX , t: clientY - baseY +scrolledY});
	}
	
	function handleScroll() {
		scrolledX = main.scrollLeft - initialScrollX;
		scrolledY = main.scrollTop - initialScrollY;
		coords.set({ l: clientX - baseX +scrolledX, t: clientY - baseY +scrolledY});
	}

	function handlePointerDown(e) {
		if (e.button != 0) return;
		timeStart = e.timeStamp;
		document.addEventListener("pointerup", handlePointerUp, { once: true });
		timeout = setTimeout(() => {
			mainBoundingRect = main.getBoundingClientRect();
			dragging = true;
			initialScrollX = main.scrollLeft;
			initialScrollY = main.scrollTop;
			baseX = e.clientX
			baseY = e.clientY
			offsetX = e.offsetX;
			offsetY = e.offsetY;
			document.addEventListener("mousemove", handleDrag);
			main.addEventListener("scroll", handleScroll);
		}, delay);
	}
	function handlePointerUp(e) {
		let time = e.timeStamp - timeStart;
		if (time < delay && e.target == article) redirectClick(e);
		clearTimeout(timeout);
		dragging = false;
		document.removeEventListener("mousemove", handleDrag);
		main.removeEventListener("scroll", handleScroll);
		coords.set({ l: 0, t: 0 });
		scrolledX = 0;
		scrolledY = 0;
		timeStart = undefined;
	}
</script>

<article
	class="task-card"
	bind:this={article}
	on:pointerdown={handlePointerDown}
	class:dragging
	style:left={$boundCoords.l + "px"}
	style:top={$boundCoords.t + "px"}
>
	<h3 class="task-title">
		{title}
	</h3>
	{completed} of {total} subtasks
	<button bind:this={button} on:click|stopPropagation={handleClick}>View full task info</button>
</article>

<style lang="scss">
	:global(body):has(.dragging) {
		cursor: pointer;

		& :global(*) {
			user-select: none;
		}

		& :global(button),
		& article:not(.dragging) {
			pointer-events: none;
		}
	}

	.task-card {
		position: relative;
		width: 100%;
		box-sizing: border-box;
		padding: 23px 16px;
		border-radius: 8px;
		background: white;
		margin-bottom: 20px;
		box-shadow: 0px 4px 6px rgba(54, 78, 126, 0.101545);
		background: var(--background-color);
	}
	.task-card.dragging {
		position: relative;
		z-index: 1;
	}
	:global(.hoverable) .task-card:hover {
		cursor: pointer;
		& .task-title {
			color: var(--main-purple);
		}
	}
	.task-card:active:not(.dragging),
	.task-card:has(button:focus-visible) {
		margin-top: 4px;
		margin-bottom: 16px;
		box-shadow: none;
		& .task-title {
			color: var(--main-purple);
		}
	}
	.task-card:has(button:focus-visible) {
		outline: auto;
	}
	.task-title {
		margin-bottom: 8px;
		pointer-events: none;
	}

	button {
		@extend %screen-reader-only;
	}
</style>
