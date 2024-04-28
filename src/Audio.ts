import alert from "./assets/audio/alert.ogg";
import ambient from "./assets/audio/ambient.ogg";
import neutral from "./assets/audio/neutral.ogg";
import unavailable from "./assets/audio/unavailable.ogg";
import positive from "./assets/audio/positive.ogg";
import negative from "./assets/audio/negative.ogg";
import tap1 from "./assets/audio/tap1.ogg";
import tap2 from "./assets/audio/tap2.ogg";
import tap3 from "./assets/audio/tap3.ogg";
import tap4 from "./assets/audio/tap4.ogg";

export default class Sound {
	private alert: HTMLAudioElement;
	private ambient: HTMLAudioElement;
	private click: HTMLAudioElement[];
	private type: HTMLAudioElement[];

	public constructor() {
		this.alert = new Audio(alert);
		this.ambient = new Audio(ambient);
		this.click = [new Audio(neutral), new Audio(unavailable), new Audio(positive), new Audio(negative)];
		this.type = [new Audio(tap1), new Audio(tap2), new Audio(tap3), new Audio(tap4)];

		window.addEventListener("click", this.onClick.bind(this));
		window.addEventListener("keypress", this.onInput.bind(this));
	}

	private reset() {
		this.alert.pause();
		this.alert.currentTime = 0;

		this.ambient.pause();
		this.ambient.currentTime = 0;

		for (let index = 0; index < this.click.length; index++) {
			this.click[index].pause();
			this.click[index].currentTime = 0;
		}

		for (let index = 0; index < this.type.length; index++) {
			this.type[index].pause();
			this.type[index].currentTime = 0;
		}
	}

	public playAlert(): void {
		this.reset();
		this.alert.play();
	}

	public playAmbient(): void {
		this.reset();
		this.ambient.play();
	}

	private onClick(event: MouseEvent): void {
		const { tagName, type } = event.target as HTMLButtonElement;

		if (tagName === "INPUT") this.click[0].play();
		else if (tagName !== "BUTTON") this.click[1].play();
		else if (type === "submit") this.click[2].play();
		else if (type === "reset") this.click[3].play();
		else this.click[0].play();
	}

	private onInput(event: KeyboardEvent): void {
		const { tagName } = event.target as HTMLInputElement;

		if (tagName === "INPUT") this.type[Math.floor(Math.random() * this.type.length)].play();
	}
}
