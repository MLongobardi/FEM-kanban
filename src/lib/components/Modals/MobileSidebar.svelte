<script>
    import { BoardList, DarkLightSwitch } from "$comps";
</script>

<div>
    <BoardList />
    <DarkLightSwitch />
</div>

<style>
    div {
        background: white;
    }
    :global(.dark) div {
        background: var(--dark-grey)
    }
</style>