export default async function (): Promise<boolean> {
	if (!window.navigator.xr) return false;
	return await window.navigator.xr.isSessionSupported("immersive-ar");
}
