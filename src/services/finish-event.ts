import {
	SIDE,
	TOKENS_LEFT_POOL_SEEDS_PREFIX,
	TOKENS_RIGHT_POOL_SEEDS_PREFIX,
	TOKENS_SYSTEM_FEE_SEEDS_PREFIX,
} from "@/utils/constants";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { Program, web3 } from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { addCreateAtaInsIfNotExist } from "./get-or-create-ata-ins";

export const finishEvent = async ({
	signer,
	program,
	eventId,
	leftMint,
	rightMint,
	optionCorrect,
	eventPubkey,
}: {
	signer: web3.PublicKey;
	program: Program<EventProtocol>;
	eventId: web3.PublicKey;
	leftMint: web3.PublicKey | null;
	rightMint: web3.PublicKey | null;
	optionCorrect: "left" | "right";
	eventPubkey: web3.PublicKey;
}) => {
	const transaction = new web3.Transaction();

	const [masterAccount] = web3.PublicKey.findProgramAddressSync(
		[Buffer.from("master")],
		program.programId,
	);

	const [leftPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_LEFT_POOL_SEEDS_PREFIX, eventId.toBuffer()],
		program.programId,
	);

	const [rightPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_RIGHT_POOL_SEEDS_PREFIX, eventId.toBuffer()],
		program.programId,
	);

	console.log(await program.provider.connection.getAccountInfo(rightPool));

	let creatorLeftBeneficiaryAta = null;
	let creatorRightBeneficiaryAta = null;
	let systemRightFee = null;
	let systemLeftFee = null;
	let leftPoolValue = null;
	let rightPoolValue = null;

	if (optionCorrect === "left" && rightMint) {
		systemRightFee = web3.PublicKey.findProgramAddressSync(
			[TOKENS_SYSTEM_FEE_SEEDS_PREFIX, rightMint.toBuffer()],
			program.programId,
		)[0];

		creatorRightBeneficiaryAta = await addCreateAtaInsIfNotExist(
			transaction,
			program.provider.connection,
			systemRightFee,
			rightMint,
			signer,
		);
		rightPoolValue = rightPool;
	} else if (optionCorrect === "right" && leftMint) {
		systemLeftFee = web3.PublicKey.findProgramAddressSync(
			[TOKENS_SYSTEM_FEE_SEEDS_PREFIX, leftMint.toBuffer()],
			program.programId,
		)[0];

		creatorLeftBeneficiaryAta = await addCreateAtaInsIfNotExist(
			transaction,
			program.provider.connection,
			systemLeftFee,
			leftMint,
			signer,
		);
		leftPoolValue = leftPool;
	}

	console.log("finish event", {
		leftMint,
		creatorLeftBeneficiaryAta,
		systemLeftFee,
		leftPool: leftPoolValue,

		rightMint,
		creatorRightBeneficiaryAta,
		systemRightFee,
		rightPool: rightPoolValue,
	});

	const finishEventInstruction = await program.methods
		.finishEvent(optionCorrect === "left" ? SIDE.Left : SIDE.Right)
		.accountsStrict({
			leftMint,
			creatorLeftBeneficiaryAta,
			systemLeftFee,
			leftPool: leftPoolValue,

			rightMint,
			creatorRightBeneficiaryAta,
			systemRightFee,
			rightPool: rightPoolValue,

			master: masterAccount,
			event: eventPubkey,
			signer,
			systemProgram: web3.SystemProgram.programId,
			tokenProgram: spl.TOKEN_PROGRAM_ID,
			associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
		})
		.instruction();

	transaction.add(finishEventInstruction);
	const result = await program?.provider?.sendAndConfirm?.(transaction, [], {
		commitment: "finalized",
	});

	return result;
};
