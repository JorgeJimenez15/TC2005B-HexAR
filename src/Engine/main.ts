import { Scene, HemisphereLight, PerspectiveCamera, WebGLRenderer } from "three";

export default class {
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;
	private session: XRSession | null;

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

		// * Session
		this.session = null;

		// * Event listeners
		window.addEventListener("resize", this.onResize.bind(this));
	}

	public async start(): Promise<void> {
		this.session = await window.navigator.xr!.requestSession("immersive-ar", {
			requiredFeatures: ["hit-test"],
			optionalFeatures: ["dom-overlay"],
		});

		this.renderer.xr.setReferenceSpaceType("local");
		await this.renderer.xr.setSession(this.session);
	}

	public async stop(): Promise<void> {
		if (this.session) await this.session.end();
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
