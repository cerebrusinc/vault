import { Deta } from "deta";

const deta = Deta(import.meta.env.VITE_MICRO_KEY);

const db = deta.Base("passmanager");

export const authorise = async (pin: string): Promise<boolean> => {
	try {
		const res = await db.get("access_pin");
		if (res) {
			const { pin: dbPin } = res;

			if (pin === dbPin) return true;
			else return false;
		} else {
			const set = await db.insert({ pin }, "access_pin");

			if (set) return true;
			else return false;
		}
	} catch (ex) {
		console.log(`$lib/db authroise error:\n${ex}`);
		return false;
	}
};

export interface Password {
	key: string;
	id: string;
	link: string;
	password: string;
	service: string;
	username: string;
	index?: number;
}

export const getAllPasses = async (): Promise<Password[]> => {
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

		return returnArr;
	} catch (ex) {
		console.log(`$lib/db getAllPasses error:\n${ex}`);
		return [];
	}
};

export const addPassword = async (passData: Password): Promise<boolean> => {
	try {
		const { link, password, service, username, id } = passData;
		const res = await db.put({
			link,
			password,
			service,
			username,
			id,
		});

		if (res) return true;
		return false;
	} catch (ex) {
		console.log(`$lib/db addPassword error:\n${ex}`);
		return false;
	}
};

export const patchPassword = async (passData: Password): Promise<boolean> => {
	try {
		const { link, password, service, username, key } = passData;
		const res = await db.update(
			{
				link,
				password,
				service,
				username,
			},
			key
		);

		return true;
	} catch (ex) {
		console.log(`$lib/db addPassword error:\n${ex}`);
		return false;
	}
};

export const delPassword = async (key: string): Promise<boolean> => {
	try {
		const res = await db.delete(key);
		return true;
	} catch (ex) {
		console.log(`$lib/db delPassword error:\n${ex}`);
		return false;
	}
};
