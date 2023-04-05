<script>
	import { dialogStore, mainStore, mediaStore } from "$stores";
	import { spring } from "svelte/motion";
	import { derived } from "svelte/store";
	export let colId, taskId, title, completed, total, main//, send, receive, flip;
	let button,
		article,
		timeout,
		mainBoundingRect,
		dragging = false,
		neverDragged = true,
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
		boundOffset = {
			l: 3,
			r: 3 + 16, //sidebar
			t: 3 + 4, //I don't know why but it needs 4px more
			b: 3 + 12, //sidebar
		},
		delay = 350;

	const coords = spring(
		{ l: 0, t: 0 },
		{
			stiffness: 0.1,
			damping: 0.27,
			precision: 0.1,
		}
	);

	const boundCoords = derived(coords, ($c) => {
		let bl = $c.l - offsetX + baseX - scrolledX;
		let bt = $c.t - offsetY + baseY - scrolledY;
		if (article && !neverDragged) {
			bl = Math.max(bl, mainBoundingRect.left + boundOffset.l);
			bl = Math.min(bl, mainBoundingRect.right - article.offsetWidth - boundOffset.r);
			bt = Math.max(bt, mainBoundingRect.top + boundOffset.t);
			bt = Math.min(bt, mainBoundingRect.bottom - article.offsetHeight - boundOffset.b);
		}

		return { l: bl + offsetX - baseX + scrolledX, t: bt + offsetY - baseY + scrolledY };
	});

	function redirectClick(e) {
		if (e.target != button) button.click();
	}

	function handleClick() {
		mainStore.beforeActionModal("TASK", "VIEW", [colId, taskId]);
		$dialogStore.VIEWTASK.open();
	}

	function updateCoords() {
		coords.set(
			{ l: clientX - baseX + scrolledX, t: clientY - baseY + scrolledY },
			{ hard: $mediaStore.misc.prefersReducedMotion }
		);
	}

	function handleDrag(e) {
		//mainBoundingRect = main.getBoundingClientRect(); //shouldn't be needed
		neverDragged = false;
		clientX = e.clientX;
		clientY = e.clientY;
		updateCoords();
	}

	function handleScroll() {
		scrolledX = main.scrollLeft - initialScrollX;
		scrolledY = main.scrollTop - initialScrollY;
		updateCoords();
	}

	function handlePointerDown(e) {
		if (e.button != 0) return;
		document.addEventListener("pointerup", handlePointerUp, { once: true });
		if (!$mediaStore.misc.hoverable) return;
		mainBoundingRect = main.getBoundingClientRect();
		if (article.offsetWidth > mainBoundingRect.width - boundOffset.l - boundOffset.r) return;
		if (article.offsetHeight > mainBoundingRect.height - boundOffset.t - boundOffset.b) return;
		timeout = setTimeout(() => {
			if (!article.matches(":hover")) return;
			mainBoundingRect = main.getBoundingClientRect();
			dragging = true;
			initialScrollX = main.scrollLeft;
			initialScrollY = main.scrollTop;
			baseX = e.clientX;
			baseY = e.clientY;
			clientX = baseX;
			clientY = baseY;
			offsetX = e.offsetX;
			offsetY = e.offsetY;
			document.addEventListener("mousemove", handleDrag);
			main.addEventListener("scroll", handleScroll);
			document.addEventListener("contextmenu", abort);
			updateCoords();
		}, delay);
	}
	function handlePointerUp(e) {
		clearTimeout(timeout);
		if ((!dragging || neverDragged) && e && e.target == article) redirectClick(e);
		dragging = false;
		neverDragged = true;
		document.removeEventListener("mousemove", handleDrag);
		main.removeEventListener("scroll", handleScroll);
		document.removeEventListener("contextmenu", abort);
		coords.set({ l: 0, t: 0 });
		scrolledX = 0;
		scrolledY = 0;
	}
	function abort() {
		if (dragging) {
			document.removeEventListener("pointerup", handlePointerUp);
			handlePointerUp();
		}
	}
</script>

<article
	class="task-card"
	bind:this={article}
	on:pointerdown={handlePointerDown}
	on:focusout={abort}
	class:dragging
	style:cursor={dragging && !neverDragged ? "grab" : ""}
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
	:global(body):has(.task-card:is(.dragging, :active)) {
		user-select: none;
	}
	:global(body):has(.dragging) {
		cursor: grab;

		& :global(button),
		& article:not(.dragging) {
			pointer-events: none;
		}
	}

	.task-card {
		position: relative;
		z-index: 0;
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
		//cursor: grab !important;
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
	}
	.task-card:has(button:focus-visible) {
		outline: auto;
	}

	.task-title {
		margin-bottom: 8px;
		pointer-events: none;
	}
	.task-card:is(:active, .dragging) .task-title {
		color: var(--main-purple);
	}

	button {
		@extend %screen-reader-only;
	}
</style>
