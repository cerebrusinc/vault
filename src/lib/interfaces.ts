export interface ModalInstruction {
	id: number;
	type: "CREATE" | "EDIT" | "DELETE";
	heading: string;
}

export interface Password {
	key: string;
	id: string;
	link: string;
	password: string;
	service: string;
	username: string;
	index?: number;
}
