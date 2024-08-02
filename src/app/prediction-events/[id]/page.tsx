"use client";

import sol from "/public/assets/solana.png";
import jup from "/public/assets/jupiter.png";
import raydium from "/public/assets/raydium.webp";
import {
	Card,
	CardHeader,
	Divider,
	CardBody,
	Button,
	Input,
} from "@nextui-org/react";
import dayjs from "dayjs";
import Image from "next/image";
import cx from "clsx";
import { IEvent } from "@/types/event";
import { shortAddress } from "@/utils/common";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const event: IEvent = {
	id: "1",
	address: "0x123hjb1212b4j1b24b12hjb4hj1b212412j124j1",
	name: "Karmapi Battle 1",
	description: "Guess the winner of this question?",
	start: "1",
	end: "2",
	options: [
		{
			id: "1",
			name: "Karmapi",
			description: "YES",
			token: "SOL",
			address: "0x12dhqwd qwdqdw3",
			amount: 100,
		},
		{
			id: "2",
			name: "Karmapi",
			description: "NO",
			token: "RAY",
			address: "0x1891249124912423",
			amount: 300,
		},
	],
};
const TOKEN_ICONS = {
	SOL: <Image src={sol} alt="Solana" width={24} height={24} />,
	RAY: <Image src={raydium} alt="Raydium" width={24} height={24} />,
	JUP: <Image src={jup} alt="Jupiter" width={24} height={24} />,
};
export default function EventDetail({ params }: { params: { id: string } }) {
	// TODO: Fetch event by params.id

	const [selectedOption, setSelectedOption] = useState<number | undefined>();

	const handleClickSubmit = useCallback(() => {
		if (selectedOption === 0 || selectedOption === 1) {
			toast("Submitted successfully", { type: "success" });
		} else {
			toast("Please select an option", { type: "error" });
			return;
		}
	}, [selectedOption]);

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4 md:py-10">
			<Card className="w-full md:w-[600px] md:min-w-[600px]">
				<CardHeader className="flex flex-col gap-3">
					<div className="flex w-full gap-3">
						<Image
							alt="logo"
							height={40}
							src={"/assets/logo.jpg"}
							className="h-10 w-10 rounded-full"
							width={40}
						/>
						<div className="flex flex-col">
							<p className="text-md text-primary">
								Eventprotocol Battle
							</p>
							<p className="text-small">
								{shortAddress(event.address)}
							</p>
						</div>
						<div className="ml-auto text-right">
							<div className="w-full text-right text-xs">
								<p
									className={cx(
										"text-xs",
										dayjs(Number(event.end)).isBefore(
											Date.now(),
										)
											? "text-red-500"
											: "text-green-500",
									)}
								>
									{dayjs(Number(event.end)).isBefore(
										Date.now(),
									)
										? "Ended"
										: "End Time"}
									<br />
									{dayjs(Number(event.end)).isAfter(
										Date.now(),
									) &&
										dayjs(Number(event.end)).format(
											"YYYY-MM-DD HH:mm:ss UTC Z",
										)}
								</p>
							</div>
						</div>
					</div>
					<div className="mt-8 w-4/5 text-center text-xl">
						{event.description}
					</div>

					<div className="mt-8 grid w-full grid-cols-2 justify-around">
						{event.options.map((option, index) => {
							return (
								<div
									key={option.id}
									className="flex flex-col items-center gap-2"
								>
									<div className="text-lg font-semibold">
										Option {index + 1}:{` `}
										{option.description}
									</div>

									<div className="flex flex-col items-center gap-1 text-white/80 md:flex-row">
										Vote amount:
										<div className="flex">
											{option.amount}{" "}
											{
												TOKEN_ICONS[
													option.token as keyof typeof TOKEN_ICONS
												]
											}
											{option.token}
										</div>
									</div>
								</div>
							);
						})}
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
							{event.options[0].description}
						</Button>
						<Button
							color="danger"
							variant={selectedOption === 1 ? "solid" : "light"}
							fullWidth
							onClick={() => {
								setSelectedOption(1);
							}}
						>
							{event.options[1].description}
						</Button>
					</div>
					<div className="mt-4 flex justify-between">
						<p>Vote amount</p>

						<p className="flex items-center gap-2 text-right">
							Balance: 500{" "}
							<Image
								src="/assets/solana.png"
								width={24}
								height={24}
								alt="SOl"
							/>{" "}
							SOL
						</p>
					</div>

					<div>
						<Input
							startContent={
								TOKEN_ICONS[
									event.options[selectedOption ?? 0]
										.token as keyof typeof TOKEN_ICONS
								]
							}
							endContent={
								event.options[selectedOption ?? 0].token
							}
							type="number"
							placeholder="0"
							min={0}
							labelPlacement="outside"
						/>
					</div>

					<Button
						className="bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg"
						fullWidth
						onClick={handleClickSubmit}
					>
						Submit Predict
					</Button>
					<Button
						variant="bordered"
						color="warning"
						fullWidth
						onClick={() => {}}
					>
						🏆 Claim Reward
					</Button>
				</CardBody>
				<Divider />
			</Card>
		</div>
	);
}
