export interface ModalInstruction {
	id: number;
	type: "CREATE" | "EDIT" | "DELETE";
	heading: string;
}

export const envVars = {
	dataKey: import.meta.env.VITE_PUBLIC_MICRO_KEY,
};
