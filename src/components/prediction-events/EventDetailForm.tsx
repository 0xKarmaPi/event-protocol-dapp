"use client";

import { renderMintValue, shortAddress } from "@/utils/common";
import {
	Card,
	CardHeader,
	Divider,
	CardBody,
	Button,
	Input,
	Skeleton,
	Chip,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IEvent } from "@/types/event";
import { useMutation } from "@tanstack/react-query";
import {
	CreateMakeAVoteTransaction,
	createMakeAVoteTransaction,
} from "@/services/make-a-vote";
import { Program, web3 } from "@coral-xyz/anchor";
import { useAnchor } from "@/hooks/useAnchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { EVENT_TOKEN_DECIMAL } from "@/utils/constants";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { EventProtocol } from "@/utils/smart-contract/event_protocol";
import { FaCopy } from "react-icons/fa";

export default function EventDetailForm({
	event,
	isPending,
	isError,
}: {
	event?: IEvent;
	isPending: boolean;
	isError: boolean;
}) {
	const [selectedOption, setSelectedOption] = useState<
		"left" | "right" | undefined
	>();
	const [amount, setAmount] = useState<string>("0");
	const [balanceTokenVote, setBalanceTokenVote] = useState(0);

	const { program } = useAnchor();
	const { publicKey } = useWallet();

	const mutateMakeAVote = useMutation({
		mutationFn: async (variables: CreateMakeAVoteTransaction) => {
			const tx = await createMakeAVoteTransaction(variables);
			return program?.provider?.sendAndConfirm?.(tx);
		},
		mutationKey: ["makeAVote"],
		onSuccess: (res) => {
			toast("Voted successfully", { type: "success" });
			setAmount("0");
			setSelectedOption(undefined);
		},
		onError: () => {
			toast("Failed to vote", { type: "error" });
		},
	});
	const fetchTokenBalance = useCallback(async () => {
		// Default is SOL balance
		let balance = await program.provider.connection.getBalance(publicKey!);

		try {
			let mintAddress;
			switch (selectedOption) {
				case "left":
					mintAddress = event?.left_mint;
					break;

				case "right":
					mintAddress = event?.right_mint;
					break;
			}

			if (mintAddress) {
				const associatedToken = await getAssociatedTokenAddress(
					new web3.PublicKey(mintAddress),
					publicKey!,
				);

				const account = await getAccount(
					program.provider.connection,
					associatedToken,
				);
				if (
					mintAddress ===
					process.env.NEXT_PUBLIC_EVENT_TOKEN_MINT_ADDRESS
				) {
					balance = Number(account.amount) / EVENT_TOKEN_DECIMAL;
				} else {
					balance = Number(account.amount) / web3.LAMPORTS_PER_SOL;
				}
				setBalanceTokenVote(balance);
			} else {
				setBalanceTokenVote(balance / web3.LAMPORTS_PER_SOL);
			}
		} catch (error) {
			setBalanceTokenVote(0);
		}
	}, [
		event?.left_mint,
		event?.right_mint,
		program.provider.connection,
		publicKey,
		selectedOption,
	]);

	const handleClickSubmit = useCallback(async () => {
		if (!publicKey) {
			toast("Please connect your wallet", { type: "error" });
			return;
		}
		if (!selectedOption) {
			toast("Please select an option", { type: "error" });
			return;
		}
		if (!amount || Number(amount) <= 0) {
			toast("Please enter an amount", { type: "error" });
			return;
		}
		if (Number(amount) > balanceTokenVote) {
			toast("Your balance is not enough", { type: "error" });
			return;
		}

		mutateMakeAVote.mutate({
			amount: Number(amount),
			program,
			selection: selectedOption,
			signer: publicKey,
			eventDetail: event!,
		});
	}, [
		amount,
		balanceTokenVote,
		mutateMakeAVote,
		program,
		publicKey,
		selectedOption,
		event,
	]);
	const renderBalanceUnit = useMemo(() => {
		if (selectedOption === "left") {
			return renderMintValue(event?.left_mint);
		}
		if (selectedOption === "right") {
			return renderMintValue(event?.right_mint);
		}
		return "SOL";
	}, [event?.left_mint, event?.right_mint, selectedOption]);

	const isEventEnded = useMemo(() => {
		const now = dayjs();
		const endDate = dayjs(event?.end_date);
		return now.isAfter(endDate);
	}, [event]);

	const isEventUpcomming = useMemo(() => {
		const now = dayjs();
		const startDate = dayjs(event?.start_date);
		return now.isBefore(startDate);
	}, [event]);

	const handleCopyBlink = () => {
		const blink = new URL(
			`/api/actions/vote?eventId=${event?.id}`,
			window.location.origin,
		).toString();
		navigator.clipboard
			.writeText(blink)
			.then(() => {
				toast.success("Copied to clipboard");
			})
			.catch(() => {
				toast.error("Failed to copy");
			});
	};

	useEffect(() => {
		if (publicKey && event) fetchTokenBalance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [publicKey, event, selectedOption]);

	const renderStatusLabel = (event: IEvent) => {
		const now = dayjs();
		const startDate = dayjs(event.start_date);
		const endDate = dayjs(event.end_date);

		if (now.isBefore(startDate)) {
			return (
				<div className="text-gray-400">
					<Chip color="default">Upcomming</Chip>
					<p>
						From:{" "}
						{dayjs(event.start_date).format(
							"DD MMM YYYY - HH:mm A",
						)}
					</p>
					<p>
						To:{" "}
						{dayjs(event.end_date).format("DD MMM YYYY-HH:mm A")}
					</p>
				</div>
			);
		}
		if (now.isAfter(endDate)) {
			return (
				<div className="text-red-500">
					<Chip color="danger" variant="flat">
						Ended
					</Chip>
					<p>
						From:{" "}
						{dayjs(event.start_date).format("DD MMM YYYY-HH:mm A")}
					</p>
					<p>
						To:{" "}
						{dayjs(event.end_date).format("DD MMM YYYY-HH:mm A")}
					</p>
				</div>
			);
		}
		return (
			<div className="text-green-500">
				<Chip color="success">On going</Chip>
				<p>
					From:{" "}
					{dayjs(event.start_date).format("DD MMM YYYY-HH:mm A")}
				</p>
				<p>To: {dayjs(event.end_date).format("DD MMM YYYY-HH:mm A")}</p>
			</div>
		);
	};

	if (isPending) {
		return (
			<Card className="w-[600px] space-y-5 p-4" radius="lg">
				<Skeleton className="rounded-lg">
					<div className="h-[300px] rounded-lg bg-default-300"></div>
				</Skeleton>
				<div className="space-y-3">
					<Skeleton className="w-3/5 rounded-lg">
						<div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-4/5 rounded-lg">
						<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-2/5 rounded-lg">
						<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
					</Skeleton>
					<Skeleton className="w-3/5 rounded-lg">
						<div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-4/5 rounded-lg">
						<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-2/5 rounded-lg">
						<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
					</Skeleton>
				</div>
			</Card>
		);
	}
	if (isError || !event)
		return <p className="text-white">Prediction Event not found!</p>;
	return (
		<Card className="w-full md:w-[600px] md:min-w-[600px]">
			<CardHeader className="flex flex-col gap-3">
				<div className="flex w-full gap-3">
					<Image
						alt="logo"
						height={40}
						src={"/assets/logo.png"}
						className="h-10 w-10 rounded-full"
						width={40}
					/>
					<div className="flex flex-col">
						<p className="text-md text-primary">
							Eventprotocol Battle
						</p>
					</div>
					<div className="ml-auto text-right">
						<div className="w-full text-right text-xs">
							{renderStatusLabel(event)}
						</div>
					</div>
				</div>
				<div className="mt-8 w-4/5 text-center text-xl">
					{event?.description}
				</div>

				<div className="mt-8 grid w-full grid-cols-2 justify-around">
					<div className="flex flex-col items-center gap-2">
						<div className="text-lg font-semibold">
							Option 1:{` `}
							{event.left_description}
						</div>

						<div className="flex flex-col items-center gap-1 text-white/80 md:flex-row">
							Accept:
							<div className="flex">
								{renderMintValue(event.left_mint)}
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="text-lg font-semibold">
							Option 2:{` `}
							{event.right_description}
						</div>

						<div className="flex flex-col items-center gap-1 text-white/80 md:flex-row">
							Accept:
							<div className="flex">
								{renderMintValue(event.right_mint)}
							</div>
						</div>
					</div>
				</div>
			</CardHeader>
			<Divider />
			<CardBody className="flex flex-col gap-2">
				<p>Select option</p>
				<div className="flex w-full flex-row gap-2">
					<Button
						color="success"
						variant={selectedOption === "left" ? "solid" : "light"}
						fullWidth
						onClick={() => {
							setSelectedOption("left");
						}}
					>
						{event?.left_description}
					</Button>
					<Button
						color="danger"
						variant={selectedOption === "right" ? "solid" : "light"}
						fullWidth
						onClick={() => {
							setSelectedOption("right");
						}}
					>
						{event?.right_description}
					</Button>
				</div>
				<div className="mt-4 flex justify-between">
					<p>Vote amount</p>

					<p className="flex items-center gap-2 text-right text-green-500">
						Your Balance: {balanceTokenVote.toLocaleString()}{" "}
						{renderBalanceUnit}
					</p>
				</div>

				<div>
					<Input
						endContent={renderBalanceUnit}
						type="number"
						placeholder="0"
						min={0}
						max={balanceTokenVote}
						labelPlacement="outside"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
				</div>

				<div className="grid grid-cols-4 gap-4">
					<Button
						isDisabled={
							!selectedOption ||
							!amount ||
							isEventEnded ||
							isEventUpcomming
						}
						isLoading={mutateMakeAVote.isPending}
						className="col-span-3 bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg"
						fullWidth
						onClick={handleClickSubmit}
					>
						{isEventEnded
							? "The event has ended"
							: isEventUpcomming
								? "The event has not started yet"
								: "Submit Predict"}
					</Button>
					<Button
						startContent={<FaCopy />}
						className="bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg"
						onPress={handleCopyBlink}
					>
						Copy Blink
					</Button>
				</div>
			</CardBody>
			<Divider />
		</Card>
	);
}
