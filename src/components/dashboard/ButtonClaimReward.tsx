import { useAnchor } from "@/hooks/useAnchor";
import { claimReward } from "@/services/claim-reward";
import { IEvent } from "@/types/event";
import { web3 } from "@coral-xyz/anchor";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { FaCheck, FaCrown } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ButtonClaimReward({
	event,
	refetch,
}: {
	event: IEvent;
	refetch: () => void;
}) {
	const { program } = useAnchor();

	const mutateClaimReward = useMutation({
		mutationFn: claimReward,
		mutationKey: ["claimReward"],
		onError: (error) => {
			console.log(error);

			toast("Claim reward failed", { type: "error" });
		},
		onSuccess: () => {
			toast("Claim reward success", { type: "success" });
			refetch();
		},
	});
	const onClickClaimRewards = () => {
		const correctTicket = event.tickets?.find(
			(ticket) => ticket.result === "Won",
		);
		if (correctTicket) {
			mutateClaimReward.mutate({
				eventId: new web3.PublicKey(event.id!),
				eventPubkey: new web3.PublicKey(event.pubkey),
				leftMint: event.left_mint
					? new web3.PublicKey(event.left_mint)
					: null,
				rightMint: event.right_mint
					? new web3.PublicKey(event.right_mint)
					: null,
				program,
				signer: program.provider.publicKey!,
				ticket: new web3.PublicKey(correctTicket.pubkey),
			});
		}
	};
	// Doesn't have Won ticket
	if (!event.tickets?.find((ticket) => ticket.result === "Won")) {
		return (
			<Button color="danger" variant="bordered" isDisabled>
				You Lose
			</Button>
		);
	}
	// Already claimed Won Ticket
	if (
		event.tickets?.find(
			(ticket) => ticket.result === "Won" && ticket.claimed,
		)
	) {
		return (
			<Button
				color="success"
				variant="bordered"
				isDisabled
				startContent={<FaCheck />}
			>
				Claimed
			</Button>
		);
	}
	if (event.burning) {
		return null;
	}
	// Have Won ticket & not claimed
	return (
		<Button
			onPress={onClickClaimRewards}
			color="warning"
			variant="flat"
			startContent={<FaCrown />}
			isLoading={mutateClaimReward.isPending}
		>
			Claim Rewards
		</Button>
	);
}
