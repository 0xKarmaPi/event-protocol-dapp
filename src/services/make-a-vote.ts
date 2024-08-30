import { Program, web3 } from "@coral-xyz/anchor";
import {
	SIDE,
	TICKET_SEEDS_PREFIX,
	TOKENS_LEFT_POOL_SEEDS_PREFIX,
	TOKENS_RIGHT_POOL_SEEDS_PREFIX,
} from "@/utils/constants";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { addCreateAtaInsIfNotExist } from "./get-or-create-ata-ins";
import { PublicKey, Transaction } from "@solana/web3.js";
import { IEvent } from "@/types/event";
import * as anchor from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export type CreateMakeAVoteTransaction = {
	signer: web3.PublicKey;
	program: Program<EventProtocol>;
	selection: "left" | "right";
	amount: number;
	eventDetail: IEvent;
};
export const createMakeAVoteTransaction = async ({
	signer,
	program,
	selection,
	amount,
	eventDetail,
}: CreateMakeAVoteTransaction) => {
	// create a legacy transaction
	const { blockhash, lastValidBlockHeight } =
		await program.provider.connection.getLatestBlockhash();

	const transaction = new Transaction({
		blockhash,
		lastValidBlockHeight,
		feePayer: signer,
	});

	let signerLeftAta = null;
	let signerRightAta = null;
	let leftPoolValue = null;
	let rightPoolValue = null;

	const [ticket] = web3.PublicKey.findProgramAddressSync(
		[
			TICKET_SEEDS_PREFIX,
			Buffer.from(selection === "left" ? "left" : "right"),
			new web3.PublicKey(eventDetail.id).toBuffer(),
			signer.toBuffer(),
		],
		program.programId,
	);

	if (selection === "left" && eventDetail.left_mint) {
		signerLeftAta = await addCreateAtaInsIfNotExist(
			transaction,
			program.provider.connection,
			signer,
			new PublicKey(eventDetail.left_mint),
			signer,
		);

		const [leftPool] = web3.PublicKey.findProgramAddressSync(
			[
				TOKENS_LEFT_POOL_SEEDS_PREFIX,
				new web3.PublicKey(eventDetail?.id!).toBuffer(),
			],
			program.programId,
		);
		leftPoolValue = leftPool;
	} else if (selection === "right" && eventDetail.right_mint) {
		signerRightAta = await addCreateAtaInsIfNotExist(
			transaction,
			program.provider.connection,
			signer,
			new PublicKey(eventDetail.left_mint),
			signer,
		);

		const [rightPool] = web3.PublicKey.findProgramAddressSync(
			[
				TOKENS_RIGHT_POOL_SEEDS_PREFIX,
				new web3.PublicKey(eventDetail?.id!).toBuffer(),
			],
			program.programId,
		);
		rightPoolValue = rightPool;
	}

	transaction.add(
		await program.methods
			.voteEvent(
				selection === "left" ? SIDE.Left : SIDE.Right,
				new anchor.BN(amount * web3.LAMPORTS_PER_SOL),
			)
			.accountsStrict({
				leftMint: eventDetail.left_mint
					? new web3.PublicKey(eventDetail.left_mint!)
					: null,
				leftPool: leftPoolValue,
				signerLeftAta,

				rightPool: rightPoolValue,
				rightMint: eventDetail.right_mint
					? new web3.PublicKey(eventDetail.right_mint!)
					: null,
				signerRightAta,

				event: new web3.PublicKey(eventDetail.pubkey),
				ticket,
				systemProgram: web3.SystemProgram.programId,
				signer: signer,
				tokenProgram: TOKEN_PROGRAM_ID,
			})
			.instruction(),
	);
	return transaction;
};
