<script lang="ts">
	import { login } from "../api";
	import { credentials } from "../stores";
	import logo from "../assets/image/logo.png";

	let email: string;
	let password: string;
	let error = false;

	async function submit(): Promise<void> {
		const result = await login(email, password);

		if (!result) {
			window.audio.playAlert();
			error = true;
			return;
		}

		credentials.set(result);
		localStorage.setItem("credentials", JSON.stringify(result));
	}
</script>

<div class="flex items-center justify-center">
	<div class="max-w-96 scale-75 animate-float space-y-6 transition-all duration-500 lg:scale-100">
		<!-- Logo -->
		<img src={logo} alt="Logo" />

		<!-- Form -->
		<form class="space-y-4">
			<div
				class="flex items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-3 text-neutral-100 {error
					? 'animate-slide'
					: 'hidden'}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
					/>
				</svg>

				Correo electrónico o contraseña incorrectos
			</div>

			<input
				type="email"
				class="w-full rounded-md border-2 border-curious-blue-500 bg-neutral-900 px-3 py-2 text-neutral-400 transition-colors duration-500 hover:border-curious-blue-700 focus:border-curious-blue-700 focus:outline-none"
				placeholder="Correo electrónico"
				bind:value={email}
			/>

			<input
				type="password"
				class="w-full rounded-md border-2 border-curious-blue-500 bg-neutral-900 px-3 py-2 text-neutral-400 transition-colors duration-500 hover:border-curious-blue-700 focus:border-curious-blue-700 focus:outline-none"
				placeholder="Contraseña"
				bind:value={password}
			/>

			<button
				class="w-full rounded-md bg-curious-blue-500 px-3 py-2 text-neutral-100 transition-colors duration-500 hover:bg-curious-blue-700"
				on:click|preventDefault={submit}>Iniciar sesión</button
			>
		</form>

		<!-- Footer -->
		<p class="text-center text-xs text-neutral-400">
			Desarrollado por
			<a
				href="https://www.linkedin.com/in/silvia-amaresly-dom%C3%ADnguez-garc%C3%ADa-7a1b88255/"
				target="_blank"
				class="underline transition-colors duration-500 hover:text-neutral-100">Amaresly Domínguez</a
			>,
			<a
				href="https://davidgtz.dev"
				target="_blank"
				class="underline transition-colors duration-500 hover:text-neutral-100">Dana Gutiérrez</a
			>,
			<a
				href="https://jorgejimenez.net"
				target="_blank"
				class="underline transition-colors duration-500 hover:text-neutral-100">Jorge Jiménez</a
			>
			y
			<a
				href="https://www.linkedin.com/in/said-omar-rodr%C3%ADguez-peralta-25035a291/"
				target="_blank"
				class="underline transition-colors duration-500 hover:text-neutral-100">Said Rodríguez</a
			>
		</p>
	</div>
</div>
