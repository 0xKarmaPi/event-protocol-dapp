import {
	TOKENS_LEFT_POOL_SEEDS_PREFIX,
	TOKENS_RIGHT_POOL_SEEDS_PREFIX,
	TOKENS_SYSTEM_FEE_SEEDS_PREFIX,
} from "@/utils/constants";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { Program, web3 } from "@coral-xyz/anchor";
import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { addCreateAtaInsIfNotExist } from "./get-or-create-ata-ins";
import { Transaction } from "@solana/web3.js";

export const claimReward = async ({
	signer,
	program,
	eventId,
	eventPubkey,
	leftMint,
	rightMint,
	ticket,
}: {
	signer: web3.PublicKey;
	program: Program<EventProtocol>;
	eventId: web3.PublicKey;
	eventPubkey: web3.PublicKey;
	leftMint: web3.PublicKey | null;
	rightMint: web3.PublicKey | null;
	ticket: web3.PublicKey;
}) => {
	const { blockhash, lastValidBlockHeight } =
		await program.provider.connection.getLatestBlockhash("confirmed");

	const transaction = new Transaction({
		blockhash,
		lastValidBlockHeight,
		feePayer: signer,
	});

	const [leftPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_LEFT_POOL_SEEDS_PREFIX, eventId.toBuffer()],
		program.programId,
	);
	const [rightPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_RIGHT_POOL_SEEDS_PREFIX, eventId.toBuffer()],
		program.programId,
	);

	let leftPoolValue = null;
	let rightPoolValue = null;
	let signerLeftBeneficiaryAta = null;
	let signerRightBeneficiaryAta = null;
	let systemRightFee = null;
	let systemLeftFee = null;

	if (leftMint) {
		systemLeftFee = web3.PublicKey.findProgramAddressSync(
			[TOKENS_SYSTEM_FEE_SEEDS_PREFIX, leftMint.toBuffer()],
			program.programId,
		)[0];

		signerLeftBeneficiaryAta = await addCreateAtaInsIfNotExist(
			transaction,
			program.provider.connection,
			systemLeftFee,
			leftMint,
			signer,
		);
		leftPoolValue = leftPool;
	}
	if (rightMint) {
		systemRightFee = web3.PublicKey.findProgramAddressSync(
			[TOKENS_SYSTEM_FEE_SEEDS_PREFIX, rightMint.toBuffer()],
			program.programId,
		)[0];
		signerRightBeneficiaryAta = await addCreateAtaInsIfNotExist(
			transaction,
			program.provider.connection,
			systemRightFee,
			rightMint,
			signer,
		);
		rightPoolValue = rightPool;
	}

	transaction.add(
		await program.methods
			.claimRewards()
			.accountsStrict({
				event: eventPubkey,

				leftMint,
				leftPool: leftPoolValue,
				signerLeftBeneficiaryAta,

				rightMint,
				rightPool: rightPoolValue,
				signerRightBeneficiaryAta,

				ticket,

				signer: signer,
				systemProgram: web3.SystemProgram.programId,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			})
			.instruction(),
	);
	const result = await program?.provider?.sendAndConfirm?.(transaction, [], {
		commitment: "confirmed",
		preflightCommitment: "confirmed",
	});

	return result;
};
