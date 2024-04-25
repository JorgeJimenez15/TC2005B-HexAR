/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"curious-blue": {
					50: "#eff9ff",
					100: "#def2ff",
					200: "#b6e8ff",
					300: "#75d8ff",
					400: "#2cc4ff",
					500: "#009fe3",
					600: "#008ad4",
					700: "#006eab",
					800: "#005d8d",
					900: "#064d74",
					950: "#04314d",
				},
			},
			animation: {
				fade: "fadeIn 5s ease-out",
				fadeFast: "fadeIn 0.5s ease-out",
				float: "floatIn 1s ease-out",
				slide: "slideIn 1s ease-out",
			},
			keyframes: () => ({
				fadeIn: {
					"0%": {
						opacity: 0,
					},
					"100%": {
						opacity: 1,
					},
				},
				floatIn: {
					"0%": {
						opacity: 0,
						"margin-bottom": "-48px",
					},
					"100%": {
						opacity: 1,
					},
				},
				slideIn: {
					"0%": {
						"margin-bottom": "-48px",
					},
				},
			}),
		},
	},
	plugins: [],
};
