<script>
	import { BoardList, DarkLightSwitch } from "$comps";
	import { mainStore, mediaStore } from "$stores";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	function reducedSlide(node, options) {
		if (!$mediaStore.misc.prefersReducedMotion) return slide(node, options);
	}

	/*START TEST*/
	/* The tutorial at
	 * https://learn.svelte.dev/tutorial/post-put-patch-delete
	 * doesn't exist yet, trying to piece some code together from the docs
	 */
	import { page } from "$app/stores";
	import { applyAction, deserialize } from "$app/forms";
	import { invalidateAll } from "$app/navigation";

	let testOldCol, testOldTask, testNewCol, testNewTask;
	async function testAPI() {
		const response = await fetch("/", {
			method: "POST",
			body: JSON.stringify({
				boardId: $mainStore.currentBoard,
				oldInfo: { col: testOldCol, task: testOldTask },
				newInfo: { col: testNewCol, task: testNewTask },
			}),
		});
		const result = deserialize(await response.text());
		/*
		if (result.type === "success") {
			await invalidateAll();
		}*/
		invalidateAll();

		//applyAction(result);
	}

	/*END TEST*/
</script>

{#if $mainStore.showSidebarOnBigScreen}
	<aside transition:reducedSlide|local={{ delay: 100, duration: 800, easing: quintOut, axis: "x" }}>
		<div class="top">
			<img
				class="logo"
				alt="kanban logo dark"
				src="/images/logo-{$mainStore.darkMode ? 'light' : 'dark'}.svg"
			/>
			<BoardList />
		</div>
		<!--start test-->
		<div style="margin: auto; background: rgba(100,100,100,0.1)">
			TEST<br />
			This is not a form!<br><br>
			Move task at
			<div>
				column:
				<select bind:value={testOldCol}>
					{#each $page.data.boards[$mainStore.currentBoard].columns as c, i}
						{#if c.tasks?.length > 0}
							<option value={i}>{c.name}</option>
						{/if}
					{/each}
				</select>
				index:
				<select bind:value={testOldTask}>
					{#each $page.data.boards[$mainStore.currentBoard].columns[testOldCol]?.tasks ?? [] as t, i}
						<option value={i}>{i}</option>
					{/each}
				</select>
			</div>
			To
			<div>
				column:
				<select bind:value={testNewCol}>
					{#each $page.data.boards[$mainStore.currentBoard].columns as c, i}
						<option value={i}>{c.name}</option>
					{/each}
				</select>
				index:
				<select bind:value={testNewTask}>
					{#each $page.data.boards[$mainStore.currentBoard].columns[testNewCol]?.tasks ?? [] as t, i}
						<option value={i}>{i}</option>
					{/each}
				</select>
			</div>

			<button on:click={testAPI}>test API</button>
		</div>
		<!--start test-->
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
		background: var(--background-color);
		border-right: solid 1px var(--lines-color);
		white-space: nowrap;
		height: 100%;
		--left: #{minMaxSize(24px, 32px, 768px, 1440px)};
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
