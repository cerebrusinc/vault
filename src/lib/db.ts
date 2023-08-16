import { Deta } from "deta";

const deta = Deta(import.meta.env.VITE_MICRO_KEY);

const db = deta.Base("passmanager");

export const authorise = async (pin: string): Promise<boolean> => {
	try {
		const res = await db.get("access_pin");
		if (res) {
			const { key, pin: dbPin } = res;

			if (pin === dbPin) return true;
			else return false;
		} else {
			const set = await db.insert({ pin }, "access_pin");

			if (set) return true;
			else return false;
		}
	} catch (ex) {
		console.log(`$lib/sb authroise error:\n${ex}`);
		return false;
	}
};
