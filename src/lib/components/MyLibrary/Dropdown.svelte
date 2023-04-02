<script>
	export let dropButtons = [
		{text: "Hello", func: () => {console.log("Hello")}},
		{text: "World", func: () => {console.log("World")}},
	];
</script>

<div class="dropdown-holder">
		<button class="open-dropdown">
			<slot>
				Open
			</slot>
	</button>
	<div class="dropdown">
		{#each dropButtons as b}
			<button class="dropdown-button" on:click={b.func} on:click={function() {this.blur()}}>
				{b.text}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	/**
	* :where() is used to reduce specificity, but svelte adds a class to scope styles to a component
	*/
	:where(.dropdown-holder) {
		position: relative;
		box-sizing: border-box;
	}
	:where(.dropdown) {
		--width: 150px;
		--offset: 10px;
        padding: 0 !important;
		display: none;
		width: var(--width);
		position: absolute;
		z-index: 1;
		border: solid 1px #E8E8E8;
		border-radius: 0 0 8px 8px;
		overflow: hidden;
		top: calc(100% + var(--offset));
		left: calc(50% - var(--width) / 2);
	}

	:where(.dropdown-holder:focus-within .dropdown) {
		display: block;
	}

	:where(.dropdown-button) {
		background: white;
		width: 100%;
		margin: 0;
    }
    :where(.dropdown-button:first-of-type)  {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
    }
    :where(.dropdown-button:last-of-type) {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
    }
    :where(.dropdown-button:not(:focus-visible)) {
        border-color: transparent;
    }
    :where(:global(.hoverable) .dropdown-button:hover) {
        background: #E8E8E8;
    }
</style>