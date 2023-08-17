export interface ModalInstruction {
	id: number;
	type: "CREATE" | "EDIT" | "DELETE";
	heading: string;
}
