<script lang="ts">
	import { type } from "../stores";

	export let name: string;
	const avatar = `https://ui-avatars.com/api/?name=${name}&background=009FE3&color=f5f5f5`;

	function logoutOnClick() {
		localStorage.removeItem("credentials");
		location.reload();
	}
</script>

<div class="space-y-4 bg-neutral-800 px-4 py-6">
	<!-- Profile -->
	<div class="flex items-center space-x-4">
		<img src={avatar} class="size-12 rounded-full" alt="Avatar" />
		<h2 class="text-xl text-neutral-100">{name}</h2>
	</div>

	<hr class="border-neutral-700" />

	<!-- Menu -->
	<div class="space-y-2">
		<!-- Projects -->
		<button
			class="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-lg transition-colors duration-500 hover:text-neutral-100 {$type ===
			'project'
				? 'bg-neutral-700 text-neutral-100'
				: 'text-neutral-400'}"
			type="button"
			on:click={() => type.set("project")}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 size-5">
				<path
					d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"
				/>
				<path
					d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"
				/>
			</svg>
			Proyectos
		</button>

		<!-- Models -->
		<button
			class="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-lg transition-colors duration-500 hover:text-neutral-100 {$type ===
			'model'
				? 'bg-neutral-700 text-neutral-100'
				: 'text-neutral-400'}"
			type="button"
			on:click={() => type.set("model")}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 size-5">
				<path
					d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z"
				/>
			</svg>
			Modelos
		</button>
	</div>

	<!-- Bottom -->
	<div class="absolute bottom-2">
		<!-- Logout -->
		<button
			class="flex cursor-pointer items-center rounded-md px-3 py-2 text-lg text-neutral-400 transition-colors duration-500 hover:text-neutral-100"
			on:click={logoutOnClick}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 size-5">
				<path
					fill-rule="evenodd"
					d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
					clip-rule="evenodd"
				/>
			</svg>
			Cerrar sesión
		</button>
	</div>
</div>
