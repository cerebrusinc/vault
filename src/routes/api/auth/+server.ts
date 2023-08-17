import { json } from "@sveltejs/kit";
import { db } from "$lib/server/deta";

export const PUT = async ({ params, request, cookies }) => {
	const { pin } = await request.json();
	try {
		const res = await db.get("access_pin");
		if (res) {
			const { pin: dbPin } = res;

			if (pin === dbPin) return json({ success: true });
			else return json({ success: false });
		} else {
			const set = await db.insert({ pin }, "access_pin");

			if (set) return json({ success: true });
			else return json({ success: false });
		}
	} catch (ex) {
		console.log(`$lib/db authroise error:\n${ex}`);
		return json({ success: false });
	}
};
