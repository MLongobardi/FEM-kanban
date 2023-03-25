<script>
	import { page } from "$app/stores";
	import { dialogStore, mainStore, mediaStore } from "$stores";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}

	function openModal(c,t) {
		mainStore.beforeActionModal("EDIT", [c,t]);
		$dialogStore.ADDEDITTASK.open();
	}
</script>

<main>
	Current tasks (test):
	<div style="display: flex; margin: auto; width: fit-content">
		{#each $page.data.boards[$mainStore.currentBoard].columns as c,i}
			<div>
				<h2>{c.name}</h2>
				{#each c.tasks as t,j}
					<div style="margin: 10px; width: 250px; border: 1px solid grey">
						<h3>{t.title}</h3>
						<p style="margin: 0">{t.description}</p>
						<hr>
						{#if t.subtasks.length > 0}
							<h4>Subtasks ({t.subtasks.length}):</h4>
							{#each t.subtasks as s} 
								<div style={s.isCompleted ? "text-decoration: line-through;" : "" }>{s.title}</div>
							{/each}
						{:else}
						No subtasks!<br>
						{/if}
						<button on:click={()=>{openModal(i,j)}}>edit task</button>
					</div>
				{:else}
					<div style="margin: 10px; width: 250px">
						<h2>No Tasks!</h2>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	{#if $mediaStore.currentScreen != "mobile"}
		<!--double if block so that the transition only works on the second condition, thanks to |local-->
		{#if !$mainStore.showSidebarOnBigScreen}
			<button
				class="show-sidebar"
				on:click={mainStore.toggleSidebar}
				transition:reducedSlide|local={{ axis: "x", duration: 400, easing: quintOut }}
			>
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
		overflow: auto;
	}
	:global(.dark) main {
		background: var(--very-dark-grey);
	}

	.show-sidebar {
		display: block;
		border: none;
		border-radius: 0px 100px 100px 0px;
		height: 48px;
		width: 56px;
		position: absolute;
		bottom: 32px;
		background: var(--main-purple);
		padding: 0;
	}
	:global(.hoverable) .show-sidebar:hover {
		background: var(--main-purple-hover);
	}
	.show-sidebar img {
		display: block;
		margin: auto;
	}
</style>
