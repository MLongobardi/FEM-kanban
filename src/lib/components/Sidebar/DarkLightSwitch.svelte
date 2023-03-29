<script>
    import { mainStore } from "$stores";
</script>
<div class="color-switch">
    <img alt="light mode" src="/images/icon-light-theme.svg" />
    <button on:click={mainStore.changeColorMode}>
        <span class="sr-only">Change color mode, current: {$mainStore.darkMode ? "dark" : "light"}</span>
        <span class="slider {$mainStore.darkMode ? "right" : "left"}" />
    </button>
    <img alt="dark mode" src="/images/icon-dark-theme.svg" />
</div>

<style lang="scss">
    .color-switch {
        --thisWidth: #{minMaxSize(235px, 251px, 768px, 1440px)};
        --parentWidth: var(--width, 100%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: var(--thisWidth);
        padding: 0 64px 0 64px;
        box-sizing: border-box;
        background: var(--light-grey);
        border-radius: 6px;
        height: 48px;
        //A simple margin: auto doesn't behave correctly during the sidebar slide transition
        margin-left: calc((var(--parentWidth) - var(--thisWidth)) / 2);
    }
    :global(.dark) .color-switch {
        background: var(--very-dark-grey);
    }

    button {
        --btn-color-var-1: var(--main-purple);
        --btn-color-hov-1: var(--main-purple-hover);
        border: none;
        width: 40px;
        height: 20px;
        border-radius: 12px;
        background: var(--btn-color-var-1);
        padding: 3px;
        box-sizing: border-box;
    }

    .sr-only {
        @extend %screen-reader-only;
    }

    .slider {
        --margin: 20px;
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: white;
        transition: margin 0.4s cubic-bezier(0.22, 1, 0.36, 1); //easeOutQuint
        margin-right: var(--margin);
    }
    .slider.right {
        margin-left: var(--margin);
    }
</style>