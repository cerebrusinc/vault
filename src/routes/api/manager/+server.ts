import { json } from "@sveltejs/kit";
import { db } from "$lib/server/deta";

interface Password {
	key: string;
	id: string;
	link: string;
	password: string;
	service: string;
	username: string;
	index?: number;
}

export const GET = async () => {
	// get all passwords
	try {
		const res = await db.fetch();

		const { items } = res;

		const returnArr: Password[] = [];
		let sliceI: number = 0;

		items.map((value, index) => {
			if (value.key === "access_pin") sliceI = index;
		});

		items.splice(sliceI, 1);

		items.map((value, index) => {
			if (value.key !== "access_pin")
				returnArr.push({
					// @ts-ignore
					id: value.id,
					// @ts-ignore
					key: value.key,
					// @ts-ignore
					link: value.link,
					// @ts-ignore
					password: value.password,
					// @ts-ignore
					service: value.service,
					// @ts-ignore
					username: value.username,
					index,
				});
		});

		return json({ data: returnArr });
	} catch (ex) {
		console.log(`$lib/db getAllPasses error:\n${ex}`);
		return json({ data: [] });
	}
};

export const PUT = async ({ params, request, cookies }) => {
	//add password
	const { link, password, service, username, id } = await request.json();
	try {
		const res = await db.put({
			link,
			password,
			service,
			username,
			id,
		});

		if (res) return json({ success: true });
		return json({ success: false });
	} catch (ex) {
		console.log(`$lib/db addPassword error:\n${ex}`);
		return json({ success: false });
	}
};

export const PATCH = async ({ params, request, cookies }) => {
	//edit password
	const { link, password, service, username, key } = await request.json();
	try {
		const res = await db.update(
			{
				link,
				password,
				service,
				username,
			},
			key
		);

		return json({ success: true });
	} catch (ex) {
		console.log(`$lib/db addPassword error:\n${ex}`);
		return json({ success: false });
	}
};

export const POST = async ({ params, request, cookies }) => {
	//delete a password
	const { key }: { key: string } = await request.json();
	try {
		const res = await db.delete(key);
		return json({ success: true });
	} catch (ex) {
		console.log(`$lib/db delPassword error:\n${ex}`);
		return json({ success: false });
	}
};
