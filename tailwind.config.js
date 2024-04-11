/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				elephant: {
					50: "#f0f9fb",
					100: "#daeff3",
					200: "#b9dfe8",
					300: "#89c8d7",
					400: "#52a7be",
					500: "#368ba4",
					600: "#30728a",
					700: "#2c5d72",
					800: "#2b4e5f",
					900: "#213743",
					950: "#162a36",
				},
			},
		},
	},
	plugins: [],
};
