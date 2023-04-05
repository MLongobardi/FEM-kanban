<script>
    import { BoardList, DarkLightSwitch } from "$comps";
</script>

<div class="mobile-sidebar">
    <BoardList />
    <DarkLightSwitch />
</div>

<style>
    :global(dialog):has(.mobile-sidebar) {
        width: fit-content;
        margin-top: 80px;
    }
    .mobile-sidebar {
        background: var(--background-color);
        padding: 16px 0;
    }

    .mobile-sidebar :global(.color-switch) {
        margin-left: 16px;
        margin-right: 13px;
    }

    .mobile-sidebar :global(.board) {
        width: 240px;
    }
</style>