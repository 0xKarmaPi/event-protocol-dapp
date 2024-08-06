import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

// Define the getKey function or import it if defined elsewhere

export const validateJWT = async (
	token: string,
): Promise<JwtPayload | null> => {
	try {
		const decodedToken = await new Promise<JwtPayload | null>(
			(resolve, reject) => {
				jwt.verify(
					token,
					getKey,
					{ algorithms: ["RS256"] },
					(
						err: VerifyErrors | null,
						decoded: string | JwtPayload | undefined,
					) => {
						console.log("decoded the jwt");
						if (err) {
							reject(err);
						} else {
							// Ensure that the decoded token is of type JwtPayload
							if (
								typeof decoded === "object" &&
								decoded !== null
							) {
								resolve(decoded);
							} else {
								reject(new Error("Invalid token"));
							}
						}
					},
				);
			},
		);
		return decodedToken;
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
};

// app/lib/authHelpers.ts

export const getKey = (
	headers,
	callback: (err: Error | null, key?: Secret) => void,
): void => {
	console.log("calling getKey");

	// Define the options for the fetch request
	const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.NEXT_DYNAMIC_BEARER_TOKEN}`,
		},
	};

	// Perform the fetch request asynchronously
	fetch(
		`https://app.dynamic.xyz/api/v0/sdk/d9aa4ce3-bcd5-424c-ac6c-29d5eadcb949/.well-known/jwks`,
		options,
	)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			const publicKey = json.key.publicKey;
			const pemPublicKey = Buffer.from(publicKey, "base64").toString(
				"ascii",
			);
			callback(null, pemPublicKey); // Pass the public key to the callback
		})
		.catch((err) => {
			console.error(err);
			callback(err); // Pass the error to the callback
		});
};
