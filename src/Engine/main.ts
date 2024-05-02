import {
	Scene,
	HemisphereLight,
	PerspectiveCamera,
	RingGeometry,
	MeshBasicMaterial,
	MeshLambertMaterial,
	Mesh,
	WebGLRenderer,
	Clock,
	Matrix4,
	MeshPhongMaterial,
	Object3D,
	PointLight,
} from "three";
import Controller, { type ControllerDetail } from "./Controller";
import loadOBJ from "./loaders/loadOBJ";
import Overlay from "../Overlay.svelte";

export default class {
	private projectId: number | null;
	private scene: Scene;
	private objects: Object3D[];
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;
	private time: {
		clock: Clock;
		delta: number;
	};
	private session: XRSession | null;
	private controller: Controller;
	private hitTest: {
		reticle: Mesh;
		rotation: number;
		requested: boolean;
		source: XRHitTestSource | null;
	};

	public constructor() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;

		// * Project Id
		this.projectId = null;

		// * Scene
		this.scene = new Scene();

		const hemisphereLight = new HemisphereLight(0xffffff, 0xbbbbff);
		this.scene.add(hemisphereLight);

		const pointLight = new PointLight(0xffffff);
		pointLight.position.set(0, 10, 0);
		this.scene.add(pointLight);

		// * Objects
		this.objects = [];

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

		// * Clock
		this.time = {
			clock: new Clock(),
			delta: 0,
		};

		// * XR Session
		this.session = null;

		// * Controller
		const controllerLeft = this.renderer.xr.getControllerGrip(0);
		const controllerRight = this.renderer.xr.getControllerGrip(1);

		this.controller = new Controller();

		// * Hit Test
		const geometry = new RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
		const material = new MeshBasicMaterial();

		this.hitTest = {
			reticle: new Mesh(geometry, material),
			rotation: 0,
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
			this.controller.link("left", event.data.gamepad);
		});

		controllerRight.addEventListener("connected", (event) => {
			console.log("Right controller connected");
			this.controller.link("right", event.data.gamepad);
		});

		const ROTATION_UNIT = (2 * Math.PI) / 5;

		window.addEventListener("controller", (event) => {
			const { detail } = event as CustomEvent<ControllerDetail>;

			// Rotate model
			if (detail.controller === "right" && detail.axis && detail.axis.plane === "horizontal") {
				console.log("rotate");
				this.hitTest.rotation += detail.axis.value * ROTATION_UNIT * this.time.delta;
			}

			// Place model
			if (
				detail.controller === "right" &&
				detail.button &&
				detail.button.action === "start" &&
				detail.button.type === "primary"
			) {
				const index = this.objects.length;
				const model = this.hitTest.reticle.clone();
				const material = new MeshPhongMaterial({
					color: 0xe5e5e5,
					shininess: 250,
				});

				model.traverse((child) => {
					if (child instanceof Mesh) child.material = material;
				});

				this.objects.push(model);
				this.scene.add(this.objects[index]);
			}
		});
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

	public async selectModel(source: string): Promise<void> {
		const model = await loadOBJ(`/api/files/${source}`);
		const material = new MeshLambertMaterial({
			color: 0xfafafa,
			transparent: true,
			opacity: 0.5,
		});

		model.traverse((child) => {
			if (child instanceof Mesh) child.material = material;
		});
		model.rotation.y = this.camera.rotation.y;

		this.scene.remove(this.hitTest.reticle);

		// @ts-ignore
		this.hitTest.reticle = model;
		this.hitTest.reticle.matrixAutoUpdate = false;

		this.scene.add(this.hitTest.reticle);
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

		// * Clock
		this.time.delta = this.time.clock.getDelta();

		// * Controller
		this.controller.update();

		// * Hit Test
		if (this.hitTest.source) {
			const results = frame.getHitTestResults(this.hitTest.source);

			if (this.hitTest.reticle && results.length) {
				const referenceSpace = this.renderer.xr.getReferenceSpace()!;
				const matrix = results[0].getPose(referenceSpace)!.transform.matrix;

				this.hitTest.reticle.matrix.fromArray(matrix);

				// Rotate model
				const rotationMatrix = new Matrix4();

				rotationMatrix.makeRotationY(this.hitTest.rotation);
				this.hitTest.reticle.matrix.multiply(rotationMatrix);

				this.hitTest.reticle.matrixWorldNeedsUpdate = true;
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
