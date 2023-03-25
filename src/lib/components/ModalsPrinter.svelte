<script>
	import { Dialog, AddEditBoard, AddEditTask, MobileSidebar } from "$comps";
	import { mainStore, mediaStore } from "$stores";
</script>

<Dialog name="ADDEDITBOARD" onClose={mainStore.afterActionModal}>
	<AddEditBoard />
</Dialog>
<Dialog name="ADDEDITTASK" onClose={mainStore.afterActionModal}>
	<AddEditTask />
</Dialog>
{#if $mediaStore.currentScreen == "mobile"}
	<Dialog name="MOBILESIDEBAR">
		<MobileSidebar />
	</Dialog>
{/if}
