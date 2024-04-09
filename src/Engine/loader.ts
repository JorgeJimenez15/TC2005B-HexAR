import { ObjectLoader } from "three";
import type { Object3D, Object3DEventMap } from "three";

const loader = new ObjectLoader();

export default function (url: string): Promise<Object3D<Object3DEventMap>> {
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			(object) => {
				resolve(object);
			},
			undefined,
			() => {
				reject();
			},
		);
	});
}
