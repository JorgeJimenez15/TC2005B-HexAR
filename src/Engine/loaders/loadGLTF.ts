import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export default async function (url: string): Promise<GLTF> {
	return await loader.loadAsync(url);
}
