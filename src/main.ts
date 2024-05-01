import "./style.css";
import App from "./App.svelte";
import Engine from "./Engine/main";
import Audio from "./Audio";

declare global {
	interface Window {
		engine: Engine;
		audio: Audio;
	}
}

new App({
	target: document.getElementById("app")!,
});

window.engine = new Engine();
window.audio = new Audio();
