import { Scene, HemisphereLight, PerspectiveCamera, RingGeometry, MeshBasicMaterial, Mesh, WebGLRenderer } from "three";
import loadOBJ from "./loaders/loadOBJ";
import Overlay from "../Overlay.svelte";

export default class {
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;
	private session: XRSession | null;
	private hitTest: {
		reticle: Mesh;
		requested: boolean;
		source: XRHitTestSource | null;
	};

	public constructor() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;

		// * Scene
		this.scene = new Scene();

		const light = new HemisphereLight(0xffffff, 0xbbbbff);
		this.scene.add(light);

		// * Perspective Camera
		this.camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.01, 20);

		// * WebGL Renderer
		this.renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
		});

		this.renderer.setPixelRatio(devicePixelRatio);
		this.renderer.setSize(innerWidth, innerHeight);
		this.renderer.xr.enabled = true;
		this.renderer.setAnimationLoop(this.update.bind(this));

		// * XR Session
		const controller = this.renderer.xr.getController(0);

		this.session = null;

		// * Hit Test
		const geometry = new RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
		const material = new MeshBasicMaterial();

		this.hitTest = {
			reticle: new Mesh(geometry, material),
			requested: false,
			source: null,
		};
		this.hitTest.reticle.matrixAutoUpdate = false;
		this.hitTest.reticle.visible = false;

		this.scene.add(this.hitTest.reticle);

		// * Event listeners
		window.addEventListener("resize", this.onResize.bind(this));
		controller.addEventListener("select", async () => {
			const object = await loadOBJ("/models/Conveyor.obj");

			this.hitTest.reticle.matrix.decompose(object.position, object.quaternion, object.scale);
			object.rotation.y = Math.PI / 2;

			this.scene.add(object);
		});
	}

	public async start(): Promise<void> {
		// TODO Include all properties from this class
		const overlay = document.createElement("div");
		const component = new Overlay({
			target: overlay,
			props: {
				engine: this,
			},
		});

		// overlay.style.display = "none";
		document.body.appendChild(overlay);

		this.session = await window.navigator.xr!.requestSession("immersive-ar", {
			requiredFeatures: ["hit-test"],
			// Deprecated since the Quest 3 doesn't support DOM Overlay
			// optionalFeatures: ["dom-overlay"],
			// domOverlay: {
			// 	root: overlay,
			// },
		});

		// overlay.style.display = "inline";

		this.renderer.xr.setReferenceSpaceType("local");
		await this.renderer.xr.setSession(this.session);

		this.session.addEventListener("end", () => {
			this.session = null;

			component.$destroy();
			document.body.removeChild(overlay);
		});
	}

	public async stop(): Promise<void> {
		if (this.session) await this.session.end();
	}

	private requestHitTest(): void {
		if (!this.session) return;

		this.session.requestReferenceSpace("viewer").then((space) => {
			this.session!.requestHitTestSource!({ space })?.then((source) => {
				this.hitTest.source = source;
			});
		});

		this.session.addEventListener("end", () => {
			this.hitTest.requested = false;
			this.hitTest.source = null;
		});

		this.hitTest.requested = true;
	}

	private update(timestamp: number, frame: XRFrame): void {
		if (!frame) return;
		if (!this.hitTest.requested) this.requestHitTest();

		if (this.hitTest.source) {
			const results = frame.getHitTestResults(this.hitTest.source);

			if (results.length) {
				const referenceSpace = this.renderer.xr.getReferenceSpace()!;
				const matrix = results[0].getPose(referenceSpace)!.transform.matrix;

				this.hitTest.reticle.matrix.fromArray(matrix);
				this.hitTest.reticle.visible = true;
			} else {
				this.hitTest.reticle.visible = false;
			}
		}

		this.renderer.render(this.scene, this.camera);
	}

	private onResize(): void {
		// Can't change size while VR device is presenting
		if (this.session) return;

		const { innerWidth, innerHeight } = window;

		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(innerWidth, innerHeight);
	}
}
