<script lang="ts">
	import Login from "./Login.svelte";
	import Home from "./Home.svelte";

	// Auth
	import type { Credentials } from "./api";
	import { credentials } from "./stores";
	let auth: Credentials;

	const storage = localStorage.getItem("credentials");
	if (storage) credentials.set(JSON.parse(storage) as Credentials);

	credentials.subscribe((value) => {
		auth = value;
	});
</script>

<main class="h-screen w-screen bg-neutral-900">
	{#if auth}
		<Home credentials={auth} />
	{:else}
		<Login />
	{/if}
</main>
