<script lang="ts">
	import type { User, Credentials } from "../api";
	import { createProject, createModel } from "../api";
	import { modal } from "../stores";

	export let user: User;
	export let credentials: Credentials;
	let name: string;
	let file: FileList;

	function cancel() {
		modal.set({
			show: false,
			type: $modal.type,
		});
	}

	async function projectOnClick(): Promise<void> {
		await createProject(name, user.email, credentials.token);
		location.reload();
	}

	async function modalOnClick(): Promise<void> {
		console.log(file);

		await createModel(name, credentials.token, file[0]);
		location.reload();
	}
</script>

<div
	class="{$modal.show
		? 'animate-fadeFast'
		: 'hidden'} absolute z-10 flex h-screen w-screen items-center justify-center backdrop-blur-sm"
>
	{#if $modal.type === "project"}
		<form class="min-w-96 max-w-lg space-y-3 rounded-md bg-neutral-700 px-6 py-4 text-neutral-400">
			<h1 class="text-2xl text-neutral-100">Nuevo proyecto</h1>
			<p class="italic">
				"Un nombre es el primer paso para dar vida a un nuevo proyecto; es la semilla que germina la creatividad
				y desata el potencial de la innovación."
			</p>
			<input
				type="text"
				class="w-full rounded-md border-2 border-neutral-600 bg-neutral-700 px-3 py-2 transition-colors duration-500 hover:border-neutral-400 focus:border-neutral-400 focus:outline-none"
				placeholder="Nombre"
				bind:value={name}
			/>
			<div class="flex justify-end gap-2">
				<button
					class="rounded-md bg-neutral-700 px-3 py-2 text-neutral-100 transition-colors duration-500 hover:bg-neutral-800"
					type="reset"
					on:click|preventDefault={cancel}>Cancelar</button
				>
				<button
					class="rounded-md bg-curious-blue-500 px-3 py-2 text-neutral-100 transition-colors duration-500 hover:bg-curious-blue-700"
					type="submit"
					on:click|preventDefault={projectOnClick}>Crear</button
				>
			</div>
		</form>
	{:else if $modal.type === "model"}
		<form class="min-w-96 max-w-lg space-y-3 rounded-md bg-neutral-700 px-6 py-4 text-neutral-400">
			<h1 class="text-2xl text-neutral-100">Nuevo modelo</h1>
			<p class="italic">
				"Tu modelo 3D es más que una representación visual; es una ventana hacia mundos imaginarios y realidades
				virtuales. ¡Súbela y déjala brillar ante el mundo!"
			</p>
			<input
				type="text"
				class="w-full rounded-md border-2 border-neutral-600 bg-neutral-700 px-3 py-2 transition-colors duration-500 hover:border-neutral-400 focus:border-neutral-400 focus:outline-none"
				placeholder="Nombre"
				bind:value={name}
			/>
			<input
				type="file"
				class="w-full rounded-md border-2 border-neutral-600 bg-neutral-700 px-3 py-2 transition-colors duration-500 hover:border-neutral-400 focus:border-neutral-400 focus:outline-none"
				bind:files={file}
			/>
			<div class="flex justify-end gap-2">
				<button
					class="rounded-md bg-neutral-700 px-3 py-2 text-neutral-100 transition-colors duration-500 hover:bg-neutral-800"
					type="reset"
					on:click|preventDefault={cancel}>Cancelar</button
				>
				<button
					class="rounded-md bg-curious-blue-500 px-3 py-2 text-neutral-100 transition-colors duration-500 hover:bg-curious-blue-700"
					type="submit"
					on:click|preventDefault={modalOnClick}>Crear</button
				>
			</div>
		</form>
	{/if}
</div>
