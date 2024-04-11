import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import type { Group, Object3DEventMap } from "three";

const loader = new OBJLoader();

export default async function (url: string): Promise<Group<Object3DEventMap>> {
	return await loader.loadAsync(url);
}
