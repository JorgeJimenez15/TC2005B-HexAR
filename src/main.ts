import "./style.css";
import App from "./App.svelte";
import Audio from "./Audio";

declare global {
	interface Window {
		audio: Audio;
	}
}

new App({
	target: document.getElementById("app")!,
});

window.audio = new Audio();
