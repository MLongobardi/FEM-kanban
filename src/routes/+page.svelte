<script>
	import { Header, Main, Sidebar, Loading, ModalsPrinter } from "$comps";
	import { mainStore, mediaStore } from "$stores";
	import { onMount } from "svelte";

	//export let data;
	let loading = true;

	onMount(() => {
		loading = false;
		/*if ($mediaStore.noPrint.prefersLight) mainStore.changeColorMode(false);
		if ($mediaStore.noPrint.prefersDark) mainStore.changeColorMode(true);*/
	});
</script>

<svelte:head>
	<title>Frontend Mentor | Kanban task management web app</title>
</svelte:head>

<div class="media-wrapper {$mediaStore.bodyClassList}" class:dark={$mainStore.darkMode}>
	{#if loading}
		<Loading />
	{/if}

	{#if $mediaStore.currentScreen != "mobile"}
		<Sidebar />
	{/if}
	<Header />
	<Main />
	<ModalsPrinter />
</div>

<style lang="scss">
	.media-wrapper {
		/*I can't add classes to the body in svelte, so this is a workaround*/
		display: contents;
	}
</style>
