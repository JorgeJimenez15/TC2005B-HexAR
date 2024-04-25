<script lang="ts">
	import { onMount } from "svelte";
	import { type Model, type Credentials, deleteModel, getModels } from "../api";
	import { modal } from "../stores";

	export let models: Model[];
	export let credentials: Credentials;

	onMount(() => {
		location.href = "#models";
	});

	function pad(number: number) {
		return ("0" + number).slice(-2);
	}

	function modelOnClick() {
		modal.set({
			show: true,
			type: "model",
		});
	}

	async function deleteOnClick(id: number) {
		await deleteModel(id, credentials.token);
		models = await getModels();
	}
</script>

<div class="col-span-3 space-y-8 bg-neutral-900 px-6 py-8">
	<div class="flex flex-row items-center justify-between">
		<h1 class="text-3xl text-neutral-100">Modelos</h1>
		<button
			class="rounded-md bg-curious-blue-500 px-3 py-2 text-neutral-100 transition-colors duration-500 hover:bg-curious-blue-700"
			on:click={modelOnClick}>Nuevo modelo</button
		>
	</div>
	<table class="w-full text-neutral-400">
		<thead class="bg-neutral-800">
			<tr>
				<th class="px-5 py-3 text-left font-normal">Nombre</th>
				<th class="px-5 py-3 text-left font-normal">Fecha de creación</th>
				<th class="px-5 py-3 text-left font-normal">Acción</th>
			</tr>
		</thead>
		<tbody>
			{#each models as model}
				<tr class="cursor-pointer transition-colors duration-500 hover:bg-neutral-700">
					<td class="px-5 py-3">{model.name}</td>
					<td class="px-5 py-3"
						>{pad(model.creation.getMonth() + 1)}/{pad(
							model.creation.getDate(),
						)}/{model.creation.getFullYear()}
						{pad(model.creation.getHours())}:{pad(model.creation.getMinutes())}</td
					>
					<td class="px-5 py-3">
						<button
							class="rounded-md bg-neutral-700 px-2 py-0.5 text-neutral-100 transition-colors duration-500 hover:bg-neutral-800"
							type="reset"
							on:click|preventDefault={() => deleteOnClick(model.id)}>Borrar</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
