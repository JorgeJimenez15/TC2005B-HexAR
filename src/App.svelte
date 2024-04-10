<script lang="ts">
	import Engine from "./Engine/main";

	const engine = new Engine();

	function start(): void {
		engine.start();
	}
</script>

<main class="m-3 space-y-4">
	<h1 class="text-3xl text-green-500">Hello, World!</h1>
	<p class="text-slate-900">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, ut accusantium distinctio beatae voluptates
		officiis repellendus vitae eos! Accusamus iste quas maxime quibusdam ratione, voluptatum culpa quis quos
		sapiente ab!
	</p>
	<button on:click={start} class="rounded-md bg-green-500 px-3 py-2 text-white">Start AR</button>
</main>
