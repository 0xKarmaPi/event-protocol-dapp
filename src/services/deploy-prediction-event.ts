import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { web3 } from "@coral-xyz/anchor";
import {
	PREDICTION_EVENT_SEEDS_PREFIX,
	SIDE,
	TOKENS_LEFT_POOL_SEEDS_PREFIX,
	TOKENS_RIGHT_POOL_SEEDS_PREFIX,
} from "@/utils/constants";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";

export type Options = {
	leftMint: web3.PublicKey | null;
	rightMint: web3.PublicKey | null;
	title?: string;
	description: string;
	startDate: anchor.BN;
	endDate: anchor.BN;
	burning?: boolean;
	leftDescription: string;
	rightDescription: string;
};

export const createPredictionEvent = async ({
	program,
	options,
	userPublicKey,
}: {
	program: anchor.Program<EventProtocol>;
	options: Options;
	userPublicKey: web3.PublicKey;
}) => {
	const {
		description,
		leftDescription,
		rightDescription,
		title = "none",
		leftMint,
		rightMint,
		startDate,
		endDate,
		burning = false,
	} = options;
	const id = web3.Keypair.generate().publicKey;

	const [event] = web3.PublicKey.findProgramAddressSync(
		[PREDICTION_EVENT_SEEDS_PREFIX, id.toBuffer()],
		program.programId,
	);

	const [leftPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_LEFT_POOL_SEEDS_PREFIX, id.toBuffer()],
		program.programId,
	);

	const [rightPool] = web3.PublicKey.findProgramAddressSync(
		[TOKENS_RIGHT_POOL_SEEDS_PREFIX, id.toBuffer()],
		program.programId,
	);

	const transaction = new web3.Transaction();

	const deployEventIns = await program.methods
		.deployEvent(
			id,
			title!,
			description,
			leftDescription,
			rightDescription,
			startDate,
			endDate,
			burning,
		)
		.accountsStrict({
			signer: userPublicKey,
			event,
			systemProgram: web3.SystemProgram.programId,
			leftMint,
			rightMint,
			tokenProgram: spl.TOKEN_PROGRAM_ID,
		})
		.instruction();

	transaction.add(deployEventIns);

	if (leftMint) {
		const creatLeftTokenEventPoolIns = await program.methods
			.createEventTokenAccount(SIDE.Left)
			.accountsStrict({
				event,
				mint: leftMint!,
				pool: leftPool,
				signer: userPublicKey,
				systemProgram: web3.SystemProgram.programId,
				tokenProgram: spl.TOKEN_PROGRAM_ID,
			})
			.instruction();

		transaction.add(creatLeftTokenEventPoolIns);
	}

	if (rightMint) {
		const creatRightTokenEventPoolIns = await program.methods
			.createEventTokenAccount(SIDE.Right)
			.accountsStrict({
				event,
				mint: rightMint!,
				pool: rightPool,
				signer: userPublicKey,
				systemProgram: web3.SystemProgram.programId,
				tokenProgram: spl.TOKEN_PROGRAM_ID,
			})
			.instruction();

		transaction.add(creatRightTokenEventPoolIns);
	}

	await program?.provider?.sendAndConfirm?.(transaction, [], {
		commitment: "finalized",
	});

	return {
		id,
		event,
		leftPool,
		rightPool,
	};
};
