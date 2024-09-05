export function shortAddress(
	address: string | null | undefined,
	start = 4,
	end = 3,
): string {
	try {
		if (!address) {
			return "";
		}
		if (address.startsWith("maven:")) {
			start = 10;
		}
		if (address.length <= start + end) {
			return address;
		}
		return `${address.substring(0, start)}...${address.substring(address.length - end, address.length)}`;
	} catch (error) {
		return "";
	}
}

export const formatPrice = (price: number): string => {
	// Format price with comma separators for thousands and two decimal places
	return price.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export const renderMintValue = (mint?: string) => {
	if (!mint) return "SOL";
	if (mint === process.env.NEXT_PUBLIC_EVENT_TOKEN_MINT_ADDRESS)
		return "$EVENT";
	return shortAddress(mint);
};

export const generateBlink = (actionUrl: string) => {
	const encodedUrl = encodeURIComponent(`solana-action:${actionUrl}`);
	return `https://dial.to/?action=${encodedUrl}`;
};
