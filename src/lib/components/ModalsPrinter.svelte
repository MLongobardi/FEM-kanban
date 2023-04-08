<script>
	import { Dialog, AddEditTaskBoard, ViewTask, DeleteTaskBoard, MobileSidebar } from "$comps";
	import { mainStore, mediaStore } from "$stores";
</script>

<Dialog name="ADDEDITTASKBOARD" let:inTransition onClose={mainStore.afterActionModal}>
	<AddEditTaskBoard {inTransition} />
</Dialog>
<Dialog name="VIEWTASK" let:inTransition onClose={mainStore.afterActionModal}>
	<ViewTask {inTransition} />
</Dialog>
<Dialog name="DELETETASKBOARD" let:inTransition onClose={mainStore.afterActionModal}>
	<DeleteTaskBoard {inTransition} />
</Dialog>
{#if $mediaStore.currentScreen == "mobile"}
	<Dialog name="MOBILESIDEBAR" let:inTransition>
		<MobileSidebar {inTransition} />
	</Dialog>
{/if}
