import { writable } from "svelte/store";
import type { Credentials, Project } from "./api";

export const credentials = writable<Credentials>();

export type Modal = {
	show: boolean;
	type: "project" | "model";
};

export const modal = writable<Modal>({
	show: false,
	type: "project",
});

export type Type = "project" | "model";

export const type = writable<Type>();
