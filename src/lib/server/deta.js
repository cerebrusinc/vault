import { Deta } from "deta";
// import { env } from "$env/dynamic/private";
const DETA_PROJECT_KEY = process.env.DETA_PROJECT_KEY || "key";
const deta = Deta(DETA_PROJECT_KEY);

const db = deta.Base("passmanager");

export { db };
