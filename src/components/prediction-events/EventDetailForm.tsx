"use client";

import { shortAddress } from "@/utils/common";
import {
	Card,
	CardHeader,
	Divider,
	CardBody,
	Button,
	Input,
	Skeleton,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import cx from "clsx";
import sol from "/public/assets/solana.png";
import jup from "/public/assets/jupiter.png";
import raydium from "/public/assets/raydium.webp";
import { GiTwoCoins } from "react-icons/gi";
import { IEvent } from "@/types/event";
import { useMutation } from "@tanstack/react-query";
import { makeAVoteTransaction } from "@/services/make-a-vote";
import { web3 } from "@coral-xyz/anchor";
import { useAnchor } from "@/hooks/useAnchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { TICKET_SEEDS_PREFIX } from "@/utils/constants";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

const TOKEN_ICONS = {
	SOL: <Image src={sol} alt="Solana" width={24} height={24} />,
	RAY: <Image src={raydium} alt="Raydium" width={24} height={24} />,
	JUP: <Image src={jup} alt="Jupiter" width={24} height={24} />,
	CUSTOM: <GiTwoCoins className="h-6 w-6 text-yellow-500" />,
};

export default function EventDetailForm({
	event,
	isPending,
	isError,
}: {
	event?: IEvent;
	isPending: boolean;
	isError: boolean;
}) {
	const [selectedOption, setSelectedOption] = useState<number | undefined>();
	const [amount, setAmount] = useState<string>("0");
	const [balanceTokenVote, setBalanceTokenVote] = useState(0);

	const { program } = useAnchor();
	const { publicKey } = useWallet();

	const mutateMakeAVote = useMutation({
		mutationFn: makeAVoteTransaction,
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
				case 0:
					mintAddress = event?.left_mint;
					break;

				case 1:
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
				balance = Number(account.amount) / web3.LAMPORTS_PER_SOL;
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
		if (selectedOption !== 0 && selectedOption !== 1) {
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
			event: new web3.PublicKey(event?.pubkey || ""),
			program,
			selection: selectedOption === 0 ? "left" : "right",
			signer: publicKey,
		});
	}, [
		amount,
		balanceTokenVote,
		event?.pubkey,
		mutateMakeAVote,
		program,
		publicKey,
		selectedOption,
	]);
	const renderBalanceUnit = useMemo(() => {
		if (selectedOption === 0) {
			return event?.left_mint ? shortAddress(event?.left_mint) : "SOL";
		}
		if (selectedOption === 1) {
			return event?.right_mint ? shortAddress(event?.right_mint) : "SOL";
		}
		return "SOL";
	}, [event?.left_mint, event?.right_mint, selectedOption]);

	useEffect(() => {
		if (publicKey && event) fetchTokenBalance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [publicKey, event, selectedOption]);

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
						<p className="text-small">
							{shortAddress(event?.address)}
						</p>
					</div>
					<div className="ml-auto text-right">
						<div className="w-full text-right text-xs">
							<p
								className={cx(
									"text-xs",
									dayjs(event?.end_date).isBefore(Date.now())
										? "text-red-500"
										: "text-green-500",
								)}
							>
								{dayjs(event?.end_date).isBefore(Date.now())
									? "Ended"
									: "End Time"}
								<br />
								{dayjs(event?.end_date).isAfter(Date.now()) &&
									dayjs(event?.end_date).format(
										"YYYY-MM-DD HH:mm:ss UTC Z",
									)}
							</p>
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
							Vote amount:
							<div className="flex">
								{event.left_amount ?? 0}{" "}
								{event.left_mint
									? shortAddress(event.left_mint)
									: "SOL"}
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="text-lg font-semibold">
							Option 2:{` `}
							{event.right_description}
						</div>

						<div className="flex flex-col items-center gap-1 text-white/80 md:flex-row">
							Vote amount:
							<div className="flex">
								{event.right_amount ?? 0}{" "}
								{event.right_mint
									? shortAddress(event.right_mint)
									: "SOL"}
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
						variant={selectedOption === 0 ? "solid" : "light"}
						fullWidth
						onClick={() => {
							setSelectedOption(0);
						}}
					>
						{event?.left_description}
					</Button>
					<Button
						color="danger"
						variant={selectedOption === 1 ? "solid" : "light"}
						fullWidth
						onClick={() => {
							setSelectedOption(1);
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

				<Button
					isLoading={mutateMakeAVote.isPending}
					className="bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg"
					fullWidth
					onClick={handleClickSubmit}
				>
					Submit Predict
				</Button>
			</CardBody>
			<Divider />
		</Card>
	);
}
