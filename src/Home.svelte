<script lang="ts">
	import { onMount } from "svelte";
	import { modal, type } from "./stores";
	import type { Credentials, User, Project, Model } from "./api";
	import { getUser, getProjects, getModels } from "./api";

	import HomeModal from "./lib/HomeModal.svelte";
	import HomeSidebar from "./lib/HomeSidebar.svelte";
	import HomeProject from "./lib/HomeProject.svelte";
	import HomeModel from "./lib/HomeModel.svelte";

	export let credentials: Credentials;
	let user: User;
	let projects: Project[];
	let models: Model[];

	onMount(async () => {
		const { email, token } = credentials;

		const hash = new URL(location.href).hash.slice(1, -1) as "project" | "model";
		type.set(hash || "project");

		user = await getUser(email, token);

		if (user.email === undefined) {
			localStorage.removeItem("credentials");
			location.reload();
		}

		projects = await getProjects(email, token);
		models = await getModels();
		modal.set({
			show: false,
			type: "project",
		});

		window.audio.playAmbient();
	});
</script>

{#if user && projects && models}
	<div class="grid h-screen w-screen grid-cols-4">
		<HomeModal {user} {credentials} />
		<HomeSidebar name={user.name} />

		{#if $type === "project"}
			<HomeProject {projects} {credentials} />
		{:else}
			<HomeModel {models} {credentials} />
		{/if}
	</div>
{:else}
	<div class="flex h-screen w-screen flex-col items-center justify-center gap-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-16 animate-spin text-neutral-400"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
			/>
		</svg>
		<h1 class="text-2xl text-neutral-400">Cargando...</h1>
	</div>
{/if}
