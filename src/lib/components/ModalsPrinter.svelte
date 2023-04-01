<script>
	import { Dialog, AddEditBoard, AddEditTask, ViewTask, DeleteTaskBoard, MobileSidebar } from "$comps";
	import { mainStore, mediaStore } from "$stores";
</script>

<Dialog name="ADDEDITBOARD" onClose={mainStore.afterActionModal}>
	<AddEditBoard />
</Dialog>
<Dialog name="ADDEDITTASK" onClose={mainStore.afterActionModal}>
	<AddEditTask />
</Dialog>
<Dialog name="VIEWTASK" onClose={mainStore.afterActionModal}>
	<ViewTask />
</Dialog>
<Dialog name="DELETETASKBOARD" onClose={mainStore.afterActionModal}>
	<DeleteTaskBoard />
</Dialog>
{#if $mediaStore.currentScreen == "mobile"}
	<Dialog name="MOBILESIDEBAR">
		<MobileSidebar />
	</Dialog>
{/if}
