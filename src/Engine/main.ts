import { Scene, HemisphereLight, PerspectiveCamera, RingGeometry, MeshBasicMaterial, Mesh, WebGLRenderer } from "three";

export default class {
	private scene: Scene;
	private camera: PerspectiveCamera;
	private reticle: Mesh;
	private renderer: WebGLRenderer;
	private session: XRSession | null;
	private hitTest: {
		requested: boolean;
		source: XRHitTestSource | null;
	};

	public constructor() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;

		// * Scene
		this.scene = new Scene();

		const light = new HemisphereLight(0xffffff, 0xbbbbff);
		this.scene.add(light);

		// * Camera
		this.camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.01, 20);

		// * Reticle
		const geometry = new RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
		const material = new MeshBasicMaterial();

		this.reticle = new Mesh(geometry, material);
		this.reticle.matrixAutoUpdate = false;
		this.reticle.visible = false;

		this.scene.add(this.reticle);

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

		// * Hit test
		this.hitTest = {
			requested: false,
			source: null,
		};

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
		if (!frame) return;

		const referenceSpace = this.renderer.xr.getReferenceSpace();

		// Only runs once
		if (!this.hitTest.requested) {
			this.session!.requestReferenceSpace("viewer").then((space) => {
				this.session!.requestHitTestSource!({ space })?.then((source) => {
					this.hitTest.source = source;
				});
			});

			this.session!.addEventListener("end", () => {
				this.hitTest = {
					requested: false,
					source: null,
				};
			});

			this.hitTest.requested = true;
		}

		if (this.hitTest.source) {
			const results = frame.getHitTestResults(this.hitTest.source);

			if (results.length) {
				const hit = results[0];

				this.reticle.visible = true;
				this.reticle.matrix.fromArray(hit.getPose(referenceSpace!)!.transform.matrix);
			} else {
				this.reticle.visible = false;
			}
		}

		this.renderer.render(this.scene, this.camera);
	}

	private onResize(): void {
		const { innerWidth, innerHeight } = window;

		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(innerWidth, innerHeight);
	}
}
