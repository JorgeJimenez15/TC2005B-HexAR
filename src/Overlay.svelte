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

<main class="h-screen w-screen bg-neutral-800"></main>
