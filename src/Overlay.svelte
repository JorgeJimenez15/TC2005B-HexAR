<script lang="ts">
	import type Engine from "./Engine/main";
	export let engine: Engine;

	let number = 0;

	function increment() {
		number++;
	}

	function stop() {
		engine.stop();
	}
</script>

<main class="m-3 space-y-2">
	<h1 class="text-3xl text-red-500">Hello, World!</h1>
	<div class="space-x-2">
		<button on:click={increment} class="rounded-md bg-red-500 px-3 py-2 text-white">Count is {number}</button>
		<button on:click={stop} class="rounded-md bg-yellow-500 px-3 py-2 text-white">Stop AR</button>
	</div>
</main>
