import "./app.css";
import App from "./App.svelte";

import Engine from "./Engine/main";
const engine = new Engine();
setTimeout(() => {
	engine.start();
}, 1000);

const app = new App({
	target: document.getElementById("app")!,
});

export default app;
