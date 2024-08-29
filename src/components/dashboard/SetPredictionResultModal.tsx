import { IEvent } from "@/types/event";
import { renderMintValue, shortAddress } from "@/utils/common";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { finishEvent } from "@/services/finish-event";
import { web3 } from "@coral-xyz/anchor";
import { useAnchor } from "@/hooks/useAnchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

export default function SetPredictionResultModal({
	event,
	refetch,
}: {
	event: IEvent;
	refetch: () => void;
}) {
	const [selectedOption, setSelectedOption] = useState<
		"left" | "right" | null
	>(null);
	const { program } = useAnchor();
	const { publicKey } = useWallet();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const mutateSetResultEvent = useMutation({
		mutationFn: finishEvent,
		mutationKey: ["setResultEvent"],
		onSuccess: (res) => {
			if (res) {
				refetch();
				toast("Set result successfully", { type: "success" });
				onOpenChange();
			}
		},
		onError: (error) => {
			console.log(error);
			toast("Failed to set result", { type: "error" });
		},
	});

	const onConfirmSetResult = useCallback(() => {
		if (selectedOption && event.id && publicKey) {
			mutateSetResultEvent.mutate({
				eventId: new web3.PublicKey(event.id),
				leftMint: event.left_mint
					? new web3.PublicKey(event.left_mint)
					: null,
				rightMint: event.right_mint
					? new web3.PublicKey(event.right_mint)
					: null,
				optionCorrect: selectedOption,
				program,
				signer: publicKey,
				eventPubkey: new web3.PublicKey(event.pubkey),
			});
		}
	}, [
		event.pubkey,
		event.id,
		event.left_mint,
		event.right_mint,
		mutateSetResultEvent,
		program,
		publicKey,
		selectedOption,
	]);
	return (
		<>
			<Button onClick={onOpen} color="warning" variant="flat">
				Set Result
			</Button>
			<Modal
				placement="center"
				isDismissable={false}
				isOpen={isOpen}
				onOpenChange={() => {
					onOpenChange();
					setSelectedOption(null);
				}}
				className="text-foreground"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Set Prediction Result
							</ModalHeader>
							<ModalBody>
								<p className="text-center text-lg">
									{event.description}
								</p>
								<br />
								<div className="flex justify-center gap-2 text-center">
									<div
										onClick={() =>
											setSelectedOption("left")
										}
										className={clsx(
											"relative flex-1 cursor-pointer px-2 py-1",
											{
												"rounded-lg bg-gradient-to-r from-primary to-purple-400":
													selectedOption === "left",
											},
										)}
									>
										<p>
											Option 1: {event.left_description}
										</p>
										<p className="text-xs">
											Accept:{" "}
											{renderMintValue(event.left_mint)}
										</p>
										{selectedOption === "left" && (
											<FaCheckCircle className="absolute -right-1 -top-1 rounded-full bg-white text-green-600" />
										)}
									</div>
									<div
										onClick={() =>
											setSelectedOption("right")
										}
										className={clsx(
											"relative flex-1 cursor-pointer px-2 py-1",
											{
												"rounded-lg bg-gradient-to-r from-primary to-purple-400":
													selectedOption === "right",
											},
										)}
									>
										<p>
											Option 2: {event.right_description}
										</p>
										<p className="text-xs">
											Accept:{" "}
											{renderMintValue(event.right_mint)}
										</p>
										{selectedOption === "right" && (
											<FaCheckCircle className="absolute -right-1 -top-1 rounded-full bg-white text-green-600" />
										)}
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button
									isLoading={mutateSetResultEvent.isPending}
									color="primary"
									isDisabled={!selectedOption}
									onPress={onConfirmSetResult}
								>
									{selectedOption
										? "Confirm set result"
										: "Select correct option"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
