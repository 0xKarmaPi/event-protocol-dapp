import { useAnchor } from "@/hooks/useAnchor";
import { withDrawEvent } from "@/services/withdraw";
import { IEvent } from "@/types/event";
import { web3 } from "@coral-xyz/anchor";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { FaCheck, FaCoins } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ButtonWithdraw({
	event,
	refetch,
}: {
	event: IEvent;
	refetch: () => void;
}) {
	const { program } = useAnchor();

	const mutateWithDrawEvent = useMutation({
		mutationFn: withDrawEvent,
		mutationKey: ["withDrawEvent"],
		onError: (error) => {
			console.log(error);

			toast("Withdraw failed", { type: "error" });
		},
		onSuccess: () => {
			toast("Withdraw success", { type: "success" });
			refetch();
		},
	});
	const onClickWithDrawEvents = () => {
		const correctTicket = event.tickets?.find(
			(ticket) => ticket.result === "Won",
		);
		if (correctTicket) {
			mutateWithDrawEvent.mutate({
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
		return null;
	}

	// Already withdrawn Won Ticket
	if (
		event.tickets?.find(
			(ticket) => ticket.result === "Won" && ticket.withdrawn,
		)
	) {
		return (
			<Button
				color="success"
				variant="bordered"
				isDisabled
				className="w-[130px]"
				startContent={<FaCheck />}
			>
				Withdrawn
			</Button>
		);
	}

	return (
		<Button
			onPress={onClickWithDrawEvents}
			color="warning"
			variant="flat"
			startContent={<FaCoins />}
			className="w-[130px]"
			isLoading={mutateWithDrawEvent.isPending}
		>
			Withdraw
		</Button>
	);
}
