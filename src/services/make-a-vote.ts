import { Program, web3 } from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import { BN } from "bn.js";
import {
	SIDE,
	TICKET_SEEDS_PREFIX,
	TOKENS_LEFT_POOL_SEEDS_PREFIX,
	TOKENS_RIGHT_POOL_SEEDS_PREFIX,
} from "@/utils/constants";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { addCreateAtaInsIfNotExist } from "./get-or-create-ata-ins";

export const makeAVoteTransaction = async ({
	signer,
	program,
	event,
	selection,
	amount,
}: {
	signer: web3.PublicKey;
	program: Program<EventProtocol>;
	event: web3.PublicKey;
	selection: "left" | "right";
	amount: number;
}) => {
	const eventAcc = await program.account.predictionEvent.fetch(event);

	const transaction = new web3.Transaction();

	// Select Left option
	if (selection === "left") {
		// Token use to vote not SOL
		if (eventAcc.leftMint) {
			const senderAta = await addCreateAtaInsIfNotExist(
				transaction,
				program.provider.connection,
				signer,
				eventAcc.leftMint,
				signer,
			);

			const [leftPool] = web3.PublicKey.findProgramAddressSync(
				[TOKENS_LEFT_POOL_SEEDS_PREFIX, eventAcc.id.toBuffer()],
				program.programId,
			);

			const [ticket] = web3.PublicKey.findProgramAddressSync(
				[
					TICKET_SEEDS_PREFIX,
					Buffer.from("left"),
					eventAcc.id.toBuffer(),
					signer.toBuffer(),
				],
				program.programId,
			);

			transaction.add(
				await program.methods
					.voteEvent(
						SIDE.Left,
						new BN(amount * web3.LAMPORTS_PER_SOL),
					)
					.accountsStrict({
						leftMint: eventAcc.leftMint,
						leftPool: leftPool,
						signerLeftAta: senderAta,

						rightPool: null,
						rightMint: null,
						signerRightAta: null,

						event,
						ticket,
						systemProgram: web3.SystemProgram.programId,
						signer,
						tokenProgram: spl.TOKEN_PROGRAM_ID,
					})
					.instruction(),
			);
		} else {
			// Token use to vote is SOL
			const [ticket] = web3.PublicKey.findProgramAddressSync(
				[
					TICKET_SEEDS_PREFIX,
					Buffer.from("left"),
					eventAcc.id.toBuffer(),
					signer.toBuffer(),
				],
				program.programId,
			);

			transaction.add(
				await program.methods
					.voteEvent(
						SIDE.Left,
						new BN(amount * web3.LAMPORTS_PER_SOL),
					)
					.accountsStrict({
						leftMint: null,
						leftPool: null,
						signerLeftAta: null,

						rightMint: null,
						rightPool: null,
						signerRightAta: null,

						event,
						systemProgram: web3.SystemProgram.programId,
						signer,
						ticket,
						tokenProgram: spl.TOKEN_PROGRAM_ID,
					})
					.instruction(),
			);
		}
	} else {
		// Select Right option, Token use to vote not SOL
		if (eventAcc.rightMint) {
			const senderAta = await addCreateAtaInsIfNotExist(
				transaction,
				program.provider.connection,
				signer,
				eventAcc.rightMint,
				signer,
			);

			const [rightPool] = web3.PublicKey.findProgramAddressSync(
				[TOKENS_RIGHT_POOL_SEEDS_PREFIX, eventAcc.id.toBuffer()],
				program.programId,
			);

			const [ticket] = web3.PublicKey.findProgramAddressSync(
				[
					TICKET_SEEDS_PREFIX,
					Buffer.from("right"),
					eventAcc.id.toBuffer(),
					signer.toBuffer(),
				],
				program.programId,
			);

			transaction.add(
				await program.methods
					.voteEvent(
						SIDE.Right,
						new BN(amount * web3.LAMPORTS_PER_SOL),
					)
					.accountsStrict({
						leftMint: null,
						leftPool: null,
						signerLeftAta: null,

						rightPool,
						rightMint: eventAcc.rightMint,
						signerRightAta: senderAta,

						event,
						systemProgram: web3.SystemProgram.programId,
						signer,
						ticket,
						tokenProgram: spl.TOKEN_PROGRAM_ID,
					})
					.instruction(),
			);
		} else {
			// Token use to vote is SOL
			const [ticket] = web3.PublicKey.findProgramAddressSync(
				[
					TICKET_SEEDS_PREFIX,
					Buffer.from("right"),
					eventAcc.id.toBuffer(),
					signer.toBuffer(),
				],
				program.programId,
			);

			transaction.add(
				await program.methods
					.voteEvent(
						SIDE.Right,
						new BN(amount * web3.LAMPORTS_PER_SOL),
					)
					.accountsStrict({
						leftMint: null,
						leftPool: null,
						signerLeftAta: null,

						rightMint: null,
						rightPool: null,
						signerRightAta: null,

						event,
						systemProgram: web3.SystemProgram.programId,
						signer,
						ticket,
						tokenProgram: spl.TOKEN_PROGRAM_ID,
					})
					.instruction(),
			);
		}
	}
	const res = await program?.provider?.sendAndConfirm?.(transaction);
	return res;
};
