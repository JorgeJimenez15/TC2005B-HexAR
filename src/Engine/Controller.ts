// AXIS_HORIZONTAL = 2,
// AXIS_VERTICAL = 3,

type Controller = { [key: number]: string };

const BUTTON: Controller = {
	0: "trigger",
	1: "squeeze",
	3: "joystick",
	4: "primary",
	5: "secondary",
};
const PLANE: Controller = {
	2: "horizontal",
	3: "vertical",
};

type Memory = {
	[key: string]: number; // ? Prevents TypeScript from making errors when using CONTROLLER[index]
	trigger: number;
	squeeze: number;
	joystick: number;
	primary: number;
	secondary: number;
};

export type Detail = {
	controller: "left" | "right";
	button?: {
		action: "start" | "stop";
		type: string;
	};
	axis?: {
		plane: "horizontal" | "vertical";
		value: number;
	};
};

export default class {
	private controller: {
		left: {
			gamepad: XRInputSource["gamepad"] | null;
			memory: Memory;
		};
		right: {
			gamepad: XRInputSource["gamepad"] | null;
			memory: Memory;
		};
	};

	public constructor() {
		this.controller = {
			left: {
				gamepad: null,
				memory: {
					trigger: 0,
					squeeze: 0,
					joystick: 0,
					primary: 0,
					secondary: 0,
				},
			},
			right: {
				gamepad: null,
				memory: {
					trigger: 0,
					squeeze: 0,
					joystick: 0,
					primary: 0,
					secondary: 0,
				},
			},
		};
	}

	private dispatch(detail: Detail): void {
		window.dispatchEvent(
			new CustomEvent<Detail>("controller", {
				detail,
			}),
		);
	}

	public link(controller: "left" | "right", gamepad: XRInputSource["gamepad"]): void {
		this.controller[controller].gamepad = gamepad;
	}

	public update(): void {
		if (!this.controller.left.gamepad || !this.controller.right.gamepad) return;

		// * Left controller
		// * * Buttons
		for (let index = 0; index < this.controller.left.gamepad.buttons.length; index++) {
			if (this.controller.left.gamepad.buttons[index].pressed) {
				// ? Is it being pressed for the first time?
				if (this.controller.left.memory[BUTTON[index]] === 0) {
					this.dispatch({
						controller: "left",
						button: {
							action: "start",
							type: BUTTON[index],
						},
					});
				}

				this.controller.left.memory[BUTTON[index]]++;
			} else {
				// ? Is it stopped being pressed?
				if (this.controller.left.memory[BUTTON[index]] > 0) {
					this.dispatch({
						controller: "left",
						button: {
							action: "stop",
							type: BUTTON[index],
						},
					});

					this.controller.left.memory[BUTTON[index]] = 0;
				}
			}
		}

		// * * Axis
		for (let index = 0; index < this.controller.left.gamepad.axes.length; index++) {
			if (this.controller.left.gamepad.axes[index]) {
				this.dispatch({
					controller: "left",
					axis: {
						plane: PLANE[index] as "horizontal" | "vertical",
						value: this.controller.left.gamepad.axes[index],
					},
				});
			}
		}

		// * Right controller
		for (let index = 0; index < this.controller.right.gamepad.buttons.length; index++) {
			if (this.controller.right.gamepad.buttons[index].pressed) {
				// ? Is it being pressed for the first time?
				if (this.controller.right.memory[BUTTON[index]] === 0) {
					this.dispatch({
						controller: "right",
						button: {
							action: "start",
							type: BUTTON[index],
						},
					});
				}

				this.controller.right.memory[BUTTON[index]]++;
			} else {
				// ? Is it stopped being pressed?
				if (this.controller.right.memory[BUTTON[index]] > 0) {
					this.dispatch({
						controller: "right",
						button: {
							action: "stop",
							type: BUTTON[index],
						},
					});

					this.controller.right.memory[BUTTON[index]] = 0;
				}
			}
		}

		// * * Axis
		for (let index = 0; index < this.controller.right.gamepad.axes.length; index++) {
			if (this.controller.right.gamepad.axes[index]) {
				this.dispatch({
					controller: "right",
					axis: {
						plane: PLANE[index] as "horizontal" | "vertical",
						value: this.controller.right.gamepad.axes[index],
					},
				});
			}
		}
	}
}
