<script lang="ts">
	import { onMount } from "svelte";
	import type { Credentials, User, Model } from "./api";
	import { getUser, getModels } from "./api";

	let name: User["name"] = "John Doe";
	let avatar: string;
	let models: Model[] = [];

	function pad(number: number) {
		return ("0" + number).slice(-2);
	}

	function returnOnClick() {
		window.engine.stop();
	}

	function handleSelectModel(source: string) {
		window.engine.selectModel(source);
	}

	onMount(async () => {
		const { email, token } = JSON.parse(localStorage.getItem("credentials")!) as Credentials;

		name = (await getUser(email, token)).name;
		avatar = `https://ui-avatars.com/api/?name=${name}&background=009FE3&color=f5f5f5`;
		models = await getModels();
	});
</script>

<main class="grid h-screen w-screen grid-cols-4 bg-neutral-800">
	<!-- Sidebar -->
	<div class="space-y-4 bg-neutral-800 px-4 py-6">
		<!-- Profile -->
		<div class="flex items-center space-x-4">
			<img src={avatar} class="size-12 rounded-full" alt="Avatar" />
			<h2 class="text-xl text-neutral-100">{name}</h2>
		</div>

		<hr class="border-neutral-700" />

		<div class="absolute bottom-2">
			<button
				class="flex cursor-pointer items-center rounded-md px-3 py-2 text-lg text-neutral-400 transition-colors duration-500 hover:text-neutral-100"
				on:click={returnOnClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mr-2 size-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
					/>
				</svg>
				Regresar
			</button>
		</div>
	</div>

	<!-- Container -->
	<div class="col-span-3 space-y-8 bg-neutral-900 px-6 py-8">
		<div class="flex flex-row items-center justify-between">
			<h1 class="text-3xl text-neutral-100">Galería de modelos</h1>
		</div>

		<table class="w-full text-neutral-400">
			<thead class="bg-neutral-800">
				<tr>
					<th class="px-5 py-3 text-left font-normal">Nombre</th>
					<th class="px-5 py-3 text-left font-normal">Fecha de creación</th>
				</tr>
			</thead>
			<tbody>
				{#each models as model}
					<tr
						class="cursor-pointer transition-colors duration-500 hover:bg-neutral-700"
						on:click={() => handleSelectModel(model.source)}
					>
						<td class="px-5 py-3">{model.name}</td>
						<td class="px-5 py-3"
							>{pad(model.creation.getMonth() + 1)}/{pad(
								model.creation.getDate(),
							)}/{model.creation.getFullYear()}
							{pad(model.creation.getHours())}:{pad(model.creation.getMinutes())}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
