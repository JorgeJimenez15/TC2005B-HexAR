<script lang="ts">
	let number = 0;

	function increment() {
		number++;
	}
</script>

<main class="m-3 space-y-2">
	<h1 class="text-3xl text-red-500">Hello, World!</h1>
	<button class="rounded-md bg-red-500 px-3 py-2" on:click={increment}>Count is {number}</button>
</main>
