<script>
	import { Dialog, AddEditTaskBoard, ViewTask, DeleteTaskBoard, MobileSidebar } from "$comps";
	import { mainStore, mediaStore } from "$stores";
</script>

<Dialog name="ADDEDITTASKBOARD" onClose={mainStore.afterActionModal}>
	<AddEditTaskBoard />
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
