import {
	TOKENS_LEFT_POOL_SEEDS_PREFIX,
	TOKENS_RIGHT_POOL_SEEDS_PREFIX,
} from "@/utils/constants";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const deleteEvent = async ({
	program,
	eventId,
	leftMint,
	rightMint,
	eventPubkey,
	signer,
}: {
	program: anchor.Program<EventProtocol>;
	eventId: web3.PublicKey;
	leftMint: web3.PublicKey | null;
	rightMint: web3.PublicKey | null;
	eventPubkey: web3.PublicKey;
	signer: web3.PublicKey;
}) => {
	const transaction = new web3.Transaction();

	const [leftPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_LEFT_POOL_SEEDS_PREFIX, eventId.toBuffer()],
		program.programId,
	);

	const [rightPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_RIGHT_POOL_SEEDS_PREFIX, eventId.toBuffer()],
		program.programId,
	);

	const instruction = await program.methods
		.closeEvent()
		.accountsStrict({
			event: eventPubkey,
			leftMint: leftMint,
			rightMint: rightMint,
			leftPool: leftMint ? leftPool : null,
			rightPool: rightMint ? rightPool : null,
			signer: signer,
			tokenProgram: TOKEN_PROGRAM_ID,
		})
		.instruction();

	transaction.add(instruction);

	const result = await program?.provider?.sendAndConfirm?.(transaction, [], {
		commitment: "finalized",
	});

	return result;
};
