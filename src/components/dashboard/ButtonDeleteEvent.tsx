import { useAnchor } from "@/hooks/useAnchor";
import { deleteEvent } from "@/services/delete-event";
import { IEvent } from "@/types/event";
import { web3 } from "@coral-xyz/anchor";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";

export default function ButtonDeleteEvent({
	event,
	refetch,
}: {
	event: IEvent;
	refetch: () => void;
}) {
	const { program } = useAnchor();

	const mutateDeleteEvent = useMutation({
		mutationFn: deleteEvent,
		mutationKey: ["deleteEvent"],
		onSuccess: (res) => {
			if (res) {
				refetch();
				toast("Deleted event success", { type: "success" });
			}
		},
		onError: () => {
			toast("Failed to delete event", { type: "error" });
		},
	});

	const onDelete = () => {
		mutateDeleteEvent.mutate({
			eventId: new web3.PublicKey(event.id!),
			eventPubkey: new web3.PublicKey(event.pubkey),
			program,
			leftMint: event.left_mint
				? new web3.PublicKey(event.left_mint)
				: null,
			rightMint: event.right_mint
				? new web3.PublicKey(event.right_mint)
				: null,
			signer: program.provider.publicKey!,
		});
	};

	return (
		<Button
			onPress={onDelete}
			color="danger"
			variant="flat"
			isLoading={mutateDeleteEvent.isPending}
			startContent={<AiFillDelete />}
		>
			Delete
		</Button>
	);
}
