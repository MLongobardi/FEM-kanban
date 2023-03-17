<script>
	import { Header, Main, Sidebar, Loading } from "$comps";
	import { mediaStore } from "$stores";
	import { onMount } from "svelte";

	//export let data;
	let loading = true;

	onMount(() => {
		loading = false;
	});
</script>

<svelte:head>
	<title>Frontend Mentor | Kanban task management web app</title>
</svelte:head>

<div class="media-wrapper {$mediaStore.bodyClassList}">
	{#if loading}
		<Loading />
	{/if}

	{#if $mediaStore.currentScreen != "mobile"}
		<Sidebar />
	{/if}
	<Header />
	<Main />
</div>

<style lang="scss">
	.media-wrapper {
		/*I can't add classes to the body in svelte, so this is a workaround*/
		display: contents;
	}
</style>
