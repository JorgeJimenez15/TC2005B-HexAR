import { Scene, HemisphereLight, PerspectiveCamera, RingGeometry, MeshBasicMaterial, Mesh, WebGLRenderer } from "three";
import loadOBJ from "./loaders/loadOBJ";
import Overlay from "../Overlay.svelte";

export default class {
	private projectId: number | null;
	private scene: Scene;
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;
	private session: XRSession | null;
	private controller: {
		left: XRInputSource["gamepad"] | null;
		right: XRInputSource["gamepad"] | null;
	};
	private hitTest: {
		reticle: Mesh;
		requested: boolean;
		source: XRHitTestSource | null;
	};

	public constructor() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;

		// * Project Id
		this.projectId = null;

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
		const controllerLeft = this.renderer.xr.getControllerGrip(0);
		const controllerRight = this.renderer.xr.getControllerGrip(1);

		this.session = null;

		// * Input Source
		this.controller = {
			left: null,
			right: null,
		};

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

		controllerLeft.addEventListener("connected", (event) => {
			console.log("Left controller connected");
			this.controller.left = event.data.gamepad;
		});

		controllerRight.addEventListener("connected", (event) => {
			console.log("Right controller connected");
			this.controller.right = event.data.gamepad;
		});

		// Development
		// controllerRight.addEventListener("select", async () => {
		// 	const object = await loadOBJ("/models/Conveyor.obj");

		// 	this.hitTest.reticle.matrix.decompose(object.position, object.quaternion, object.scale);
		// 	object.rotation.y = this.camera.rotation.y;

		// 	this.scene.add(object);
		// });

		// controllerRight.addEventListener("squeeze", (event) => {
		// 	console.log("squeeze");
		// 	console.table(event);
		// });
	}

	public async start(id: number): Promise<void> {
		this.projectId = id;

		const app = document.getElementById("app")!;
		const overlay = document.createElement("div");
		const component = new Overlay({
			target: overlay,
		});

		document.body.appendChild(overlay);
		app.style.display = "none";

		this.session = await window.navigator.xr!.requestSession("immersive-ar", {
			requiredFeatures: ["hit-test"],
		});

		this.renderer.xr.setReferenceSpaceType("local");
		await this.renderer.xr.setSession(this.session);

		this.session.addEventListener("end", () => {
			this.session = null;

			component.$destroy();
			document.body.removeChild(overlay);
			app.style.display = "inline";
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

		// * Controller
		if (this.controller.left && this.controller.right) {
			// * Left controller
			this.controller.left.buttons.map((button, index) => {
				if (button.pressed) console.log(`Left button ${index} was pressed`);
			});
			this.controller.left.axes.map((axis, index) => {
				if (axis) console.log(`Left axis ${index}: value ${axis}`);
			});

			// * Right controller
			this.controller.right.buttons.map((button, index) => {
				if (button.pressed) console.log(`Right button ${index} was pressed`);
			});
			this.controller.right.axes.map((axis, index) => {
				if (axis) console.log(`Right axis ${index}: value ${axis}`);
			});
		}

		// * Hit Test
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
