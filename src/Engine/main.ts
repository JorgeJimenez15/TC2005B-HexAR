import { Scene, HemisphereLight, PerspectiveCamera, WebGLRenderer } from "three";

export default class {
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;

	public constructor() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;

		// * Scene
		this.scene = new Scene();

		const light = new HemisphereLight(0xffffff, 0xbbbbff);
		this.scene.add(light);

		// * Camera
		this.camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.01, 20);

		// * Renderer
		this.renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
		});

		this.renderer.setPixelRatio(devicePixelRatio);
		this.renderer.setSize(innerWidth, innerHeight);
		this.renderer.xr.enabled = true;
		this.renderer.setAnimationLoop(this.update.bind(this));

		// * Event listeners
		window.addEventListener("resize", this.onResize.bind(this));
	}

	private update(timestamp: number, frame: XRFrame): void {
		this.renderer.render(this.scene, this.camera);
	}

	private onResize(): void {
		const { innerWidth, innerHeight } = window;

		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(innerWidth, innerHeight);
	}
}
