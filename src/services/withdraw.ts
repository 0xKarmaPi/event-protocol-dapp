import {
	TOKENS_LEFT_POOL_SEEDS_PREFIX,
	TOKENS_RIGHT_POOL_SEEDS_PREFIX,
	TOKENS_SYSTEM_FEE_SEEDS_PREFIX,
} from "@/utils/constants";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { Program, web3 } from "@coral-xyz/anchor";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { addCreateAtaInsIfNotExist } from "./get-or-create-ata-ins";
import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export type WithdrawEventRequest = {
	leftMint: web3.PublicKey | null;
	rightMint: web3.PublicKey | null;
	signer: web3.PublicKey;
	program: Program<EventProtocol>;
	ticket: web3.PublicKey;
	eventId: web3.PublicKey;
	eventPubkey: web3.PublicKey;
};
export const withDrawEvent = async ({
	eventId,
	eventPubkey,
	program,
	signer,
	leftMint,
	rightMint,
	ticket,
}: WithdrawEventRequest) => {
	const transaction = new web3.Transaction();

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

		transaction.add(
			await program.methods
				.withdrawDeposited()
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

		const result = await program?.provider?.sendAndConfirm?.(
			transaction,
			[],
			{
				commitment: "finalized",
			},
		);

		return result;
	}
};
