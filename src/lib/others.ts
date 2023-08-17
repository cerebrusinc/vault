export const genPass = (): string => {
	// Minus similar characters
	const alphabet =
		"!@#$%^&*_-=+abcdefghjkmnopqrstuvwxyz123456789ABCDEFGHJKMNPQRSTUVWXYZ";

	let password = "";
	for (let i = 0; i < 12; i++) {
		password += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}
	return password;
};
