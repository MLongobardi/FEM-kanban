<script>
	import { Dialog, AddEditBoard, AddEditTask, MobileSidebar } from "$comps";
	import { mediaStore } from "$stores";
</script>

<Dialog name="ADDEDITBOARD">
	<AddEditBoard />
</Dialog>
<Dialog name="ADDEDITTASK">
	<AddEditTask />
</Dialog>
{#if $mediaStore.currentScreen == "mobile"}
	<Dialog name="MOBILESIDEBAR">
		<MobileSidebar />
	</Dialog>
{/if}
