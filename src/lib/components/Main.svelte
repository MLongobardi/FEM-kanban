<script>
    import { mainStore } from "$stores";
</script>

<main>
	<h2>This is the main</h2>
    <p>counter: {$mainStore.counter}</p>
    <p>counterSquared: {$mainStore.counterSquared}</p>
    <div>
        <button on:click={mainStore.incrementCounter}>increment</button>
        <button on:click={()=>{mainStore.resetAfterN(1000)}}>reset after 1 sec</button>
    </div>
</main>

<style>
    main {
        text-align: center;
    }
</style>