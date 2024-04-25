<script lang="ts">
	import { onMount } from "svelte";
	import { modal } from "../stores";
	import { type Project, type Credentials, getProjects, deleteProject } from "../api";
	import isARSupported from "../Engine/AR/isARSupported";
	import Engine from "../Engine/main";

	export let projects: Project[];
	export let credentials: Credentials;
	let supported: boolean = false;

	onMount(async () => {
		location.href = "#projects";
		supported = await isARSupported();
	});

	function pad(number: number) {
		return ("0" + number).slice(-2);
	}

	function createOnClick() {
		modal.set({
			show: true,
			type: "project",
		});
	}

	async function deleteOnClick(id: number) {
		await deleteProject(id, credentials.token);
		projects = await getProjects(credentials.email, credentials.token);
	}

	async function openOnClick(id: number) {
		new Engine(id);
	}
</script>

<div class="col-span-3 space-y-8 bg-neutral-900 px-6 py-8">
	<div class="flex flex-row items-center justify-between">
		<h1 class="text-3xl text-neutral-100">Proyectos</h1>
		<button
			class="rounded-md bg-curious-blue-500 px-3 py-2 text-neutral-100 transition-colors duration-500 hover:bg-curious-blue-700"
			on:click={createOnClick}>Nuevo proyecto</button
		>
	</div>
	<table class="w-full text-neutral-400">
		<thead class="bg-neutral-800">
			<tr>
				<th class="px-5 py-3 text-left font-normal">Nombre</th>
				<th class="px-5 py-3 text-left font-normal">Fecha de creación</th>
				<th class="px-5 py-3 text-left font-normal">Capturas de pantalla</th>
				<th class="px-5 py-3 text-left font-normal">Acci{supported ? "ones" : "ón"}</th>
			</tr>
		</thead>
		<tbody>
			{#each projects as project}
				<tr class="cursor-pointer transition-colors duration-500 hover:bg-neutral-700">
					<td class="px-5 py-3">{project.name}</td>
					<td class="px-5 py-3"
						>{pad(project.creation.getMonth() + 1)}/{pad(
							project.creation.getDate(),
						)}/{project.creation.getFullYear()}
						{pad(project.creation.getHours())}:{pad(project.creation.getMinutes())}</td
					>
					<td class="px-5 py-3">
						<span class="inline-block rounded-full bg-curious-blue-500 px-2 text-neutral-100">0</span>
					</td>
					<td class="space-x-2 px-5 py-3">
						<button
							class="rounded-md bg-neutral-700 px-2 py-0.5 text-neutral-100 transition-colors duration-500 hover:bg-neutral-800"
							type="reset"
							on:click|preventDefault={() => deleteOnClick(project.id)}>Borrar</button
						>

						<button
							class="rounded-md bg-curious-blue-500 px-2 py-0.5 text-neutral-100 transition-colors duration-500 hover:bg-curious-blue-700 {supported
								? ''
								: 'hidden'}"
							type="reset"
							on:click|preventDefault={() => openOnClick(project.id)}>Abrir</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
