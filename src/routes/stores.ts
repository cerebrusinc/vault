import { writable } from "svelte/store";

export const authPin = writable<string>("");
export const authed = writable<boolean>(false);
