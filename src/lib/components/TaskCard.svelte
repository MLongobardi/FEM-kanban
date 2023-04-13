<script>
	import { dialogStore, mainStore, mediaStore } from "$stores";
	import { spring } from "svelte/motion";
	import { derived } from "svelte/store";

	export let colId,
		taskId,
		title,
		completed,
		total,
		main,
		ghost = false,
		temporary = false;

	let button,
		card,
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
		};

	let heightJump = 0; //if moving a card up in the same column
	$: heightJump =
		card &&
		$mainStore.dragged?.oldInfo?.colId == $mainStore.dragged?.newInfo?.colId &&
		$mainStore.dragged?.oldInfo?.taskId > $mainStore.dragged?.newInfo?.taskId
			? -card.offsetHeight - 20
			: 0;

	const coords = spring(
		{ l: 0, t: 0 },
		{
			stiffness: 0.1,
			damping: 0.19,
			precision: 0.1,
		}
	);

	const boundCoords = derived(coords, ($c) => {
		let bl = $c.l - offsetX + baseX - scrolledX;
		let bt = $c.t - offsetY + baseY - scrolledY - heightJump;
		if (card && !neverDragged) {
			bl = Math.max(bl, mainBoundingRect.left + boundOffset.l);
			bl = Math.min(bl, mainBoundingRect.right - card.offsetWidth - boundOffset.r);
			bt = Math.max(bt, mainBoundingRect.top + boundOffset.t);
			bt = Math.min(bt, mainBoundingRect.bottom - card.offsetHeight - boundOffset.b);
		}

		return {
			l: bl + offsetX - baseX + scrolledX,
			t: bt + offsetY - baseY + scrolledY + heightJump,
		};
	});

	function redirectClick(e) {
		if (e.target != button) button.click();
	}

	function handleClick() {
		if (ghost) return;
		mainStore.beforeActionModal("TASK", "VIEW", [colId, taskId]);
		$dialogStore.VIEWTASK.open();
	}

	function updateCoords() {
		coords.set(
			{ l: clientX - baseX + scrolledX, t: clientY - baseY + scrolledY + heightJump },
			{ hard: $mediaStore.misc.prefersReducedMotion }
		);
	}

	function handleDrag(e) {
		if (neverDragged) return firstDrag(e);
		//mainBoundingRect = main.getBoundingClientRect(); //shouldn't be needed
		clientX = e.clientX;
		clientY = e.clientY;
		updateCoords();
	}
	function firstDrag(e) {
		mainStore.startDrag({ colId: colId, taskId: taskId });
		neverDragged = false;
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
		main.addEventListener("scroll", handleScroll);
		document.addEventListener("contextmenu", abort);
		updateCoords();
	}

	function handleScroll() {
		scrolledX = main.scrollLeft - initialScrollX;
		scrolledY = main.scrollTop - initialScrollY;
		updateCoords();
	}

	function handlePointerDown(e) {
		if (ghost || e.button != 0) return;
		document.addEventListener("pointerup", handlePointerUp, { once: true });
		if (!$mediaStore.misc.hoverable) return;
		if ($mainStore.dragIsPending) return;
		mainBoundingRect = main.getBoundingClientRect();
		if (card.offsetWidth > mainBoundingRect.width - boundOffset.l - boundOffset.r) return;
		if (card.offsetHeight > mainBoundingRect.height - boundOffset.t - boundOffset.b) return;
		document.addEventListener("mousemove", handleDrag);
	}

	function handlePointerUp(e) {
		if (ghost) return;
		if ((!dragging || neverDragged) && e && e.target == card) redirectClick(e);
		mainStore.endDrag();
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
			coords.set({ l: 0, t: 0 }, { hard: true });
			document.removeEventListener("pointerup", handlePointerUp);
			handlePointerUp();
		}
	}
</script>

<div
	class="task-card"
	bind:this={card}
	on:pointerdown={handlePointerDown}
	on:focusout={abort}
	class:dragging
	class:ghost
	class:temporary
	style:cursor={dragging && !neverDragged ? "grab" : ""}
	style:--ghost-offset={-card?.offsetHeight + "px"}
	style:left={$boundCoords.l + "px"}
	style:top={$boundCoords.t + "px"}
>
	<h3 class="task-title">
		{title}
	</h3>
	{completed} of {total} subtasks
	<button bind:this={button} on:click|stopPropagation={handleClick}>View full task info</button>
</div>
{#if $boundCoords.t != 0 && $boundCoords.l != 0}
	<!--like "dragging && !neverDragged", but persists while spring is still springing-->
	<svelte:self {...$$props} ghost={true} />
{/if}

<style lang="scss">
	:global(body):has(.task-card:is(.dragging, :active)) {
		user-select: none;
	}
	:global(body):has(.dragging) {
		cursor: grab;

		& :global(button),
		& div:not(.dragging) {
			pointer-events: none;
		}
	}

	.task-card {
		--click-offset: 4px;
		position: relative;
		z-index: 1;
		width: 100%;
		box-sizing: border-box;
		padding: 23px 16px;
		border-radius: 8px;
		background: white;
		margin-bottom: var(--click-offset);
		box-shadow: 0px 4px 6px rgba(54, 78, 126, 0.101545);
		background: var(--background-color);
	}
	.task-card.dragging {
		pointer-events: none;
		position: relative;
		z-index: 2;
	}
	:global(.hoverable) .task-card:hover {
		cursor: pointer;
		& .task-title {
			color: var(--main-purple);
		}
	}
	.task-card:active:not(.dragging),
	.task-card:has(button:focus-visible) {
		margin-top: var(--click-offset);
		margin-bottom: 0;
		box-shadow: none;
	}
	.task-card:has(button:focus-visible) {
		outline: auto;
	}

	.task-title {
		margin-bottom: 8px;
		pointer-events: none;
	}
	.task-card:is(:active, .dragging, .temporary) .task-title {
		color: var(--main-purple);
	}

	.task-card.ghost,
	.task-card.temporary {
		position: static; //negates z-index and left/top
		pointer-events: none;
	}
	.task-card.temporary {
		opacity: 0.7;
	}
	.task-card.ghost {
		opacity: 0.4;
		margin-top: calc(var(--ghost-offset) - var(--click-offset));
	}

	button {
		@extend %screen-reader-only;
	}
</style>
