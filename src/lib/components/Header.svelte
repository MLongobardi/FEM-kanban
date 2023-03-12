<script>
	import { Dialog } from "$comps";
	import { dialogStore } from "$stores";
</script>

<header>
	<h1>This is the header</h1>
	<p>And here is a button that opens a dialog box:</p>
	<button on:click={$dialogStore.TEST.open}>open dialog</button>
</header>

<Dialog name="TEST" easyClose>
	<div class="test-dialog">
		I'm a dialog!
		<button on:click={$dialogStore.TEST.close}>close dialog</button>
	</div>
</Dialog>

<style lang="scss">
	header {
		text-align: center;
	}

	.test-dialog {
		background: white;
		width: 600px;
        max-width: 95vw;
		height: 300px;
		border: black solid 3px;
	}

	:global(dialog):has(> .test-dialog) {
		border-radius: 30px;
	}
</style>