import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import {
	ActionPostResponse,
	createPostResponse,
	ActionGetResponse,
	ActionPostRequest,
	createActionHeaders,
	ActionError,
} from "@solana/actions";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { IEvent } from "@/types/event";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import idl from "@/utils/smart-contract/event_protocol.json";
import { renderMintValue } from "@/utils/common";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { createMakeAVoteTransaction } from "@/services/make-a-vote";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
	try {
		const requestUrl = new URL(req.url);
		const eventId = requestUrl.searchParams.get("eventId");
		const network = requestUrl.searchParams.get("network");
		const baseHref = new URL(
			`/api/actions/vote?eventId=${eventId}&network=${network}`,
			requestUrl.origin,
		).toString();

		// Fetch event detail
		const eventDetail: IEvent = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/events/${network}/${eventId}`,
		).then((res) => res.json());
		if (!eventDetail) throw "Event not found";

		const payload: ActionGetResponse = {
			type: "action",
			title: eventDetail.description,
			icon: new URL(
				"/assets/logo-text.jpg",
				requestUrl.origin,
			).toString(),
			description: `Select option below & submit amount to vote\n\n ${eventDetail.burning ? "(*)All token will be burned if you predict wrong" : ""}`,
			label: "Submit", // this value will be ignored since `links.actions` exists
			links: {
				actions: [
					{
						label: "Submit", // button text
						href: `${baseHref}&amount={amount}&selection={selection}`, // this href will have a text input
						parameters: [
							{
								name: "selection",
								label: "Select option",
								type: "radio",
								required: true,
								options: [
									{
										label: `${eventDetail.left_description} (vote with ${renderMintValue(eventDetail.left_mint)})`,
										value: "left",
									},
									{
										label: `${eventDetail.right_description} (vote with ${renderMintValue(eventDetail.right_mint)})`,
										value: "right",
									},
								],
							},
							{
								name: "amount", // parameter name in the `href` above
								label: "Enter the amount of token to vote", // placeholder of the text input
								required: true,
								type: "number",
								min: 0.01,
							},
						],
					},
				],
			},
		};

		return Response.json(payload, {
			headers,
		});
	} catch (err) {
		let actionError: ActionError = { message: "An unknown error occurred" };
		if (typeof err == "string") actionError.message = err;
		return Response.json(actionError, {
			status: 400,
			headers,
		});
	}
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
	try {
		const requestUrl = new URL(req.url);
		const eventId = requestUrl.searchParams.get("eventId");
		const network = requestUrl.searchParams.get("network");
		const selection = requestUrl.searchParams.get("selection") as
			| "left"
			| "right";
		const amount = parseFloat(requestUrl.searchParams.get("amount") || "0");
		const body: ActionPostRequest = await req.json();
		let userAccount;
		try {
			userAccount = new web3.PublicKey(body.account);
		} catch (err) {
			throw 'Invalid "account" provided';
		}

		// Fetch event detail
		const eventDetail: IEvent = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/events/${network}/${eventId}`,
		).then((res) => res.json());

		if (!eventDetail) {
			return Response.json(
				{ message: "Event not found" },
				{
					status: 400,
					headers,
				},
			);
		}

		const connection =
			network === "solana"
				? new Connection(clusterApiUrl("devnet"))
				: new Connection("https://devnet.sonic.game");

		let wallet = new NodeWallet(new Keypair());

		const provider = new anchor.AnchorProvider(connection, wallet, {
			commitment: "confirmed",
			preflightCommitment: "confirmed",
		});
		anchor.setProvider(provider);

		const program = new anchor.Program(idl as EventProtocol, provider);

		const transaction = await createMakeAVoteTransaction({
			program,
			amount,
			eventDetail,
			selection,
			signer: userAccount,
		});
		const payload: ActionPostResponse = await createPostResponse({
			fields: {
				transaction,
				message: `Voted successfully`,
			},
		});

		return Response.json(payload, {
			headers,
		});
	} catch (err) {
		console.log("err", err);

		let actionError: ActionError = { message: "An unknown error occurred" };
		if (typeof err == "string") actionError.message = err;
		return Response.json(actionError, {
			status: 400,
			headers,
		});
	}
};
