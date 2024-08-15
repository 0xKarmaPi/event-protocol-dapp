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
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import cx from "clsx";
import sol from "/public/assets/solana.png";
import jup from "/public/assets/jupiter.png";
import raydium from "/public/assets/raydium.webp";
import { GiTwoCoins } from "react-icons/gi";
import { IEvent } from "@/types/event";

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

	const handleClickSubmit = useCallback(() => {
		if (selectedOption === 0 || selectedOption === 1) {
			toast("Submitted successfully", { type: "success" });
		} else {
			toast("Please select an option", { type: "error" });
			return;
		}
	}, [selectedOption]);

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
									dayjs(event?.endTime).isBefore(Date.now())
										? "text-red-500"
										: "text-green-500",
								)}
							>
								{dayjs(event?.endTime).isBefore(Date.now())
									? "Ended"
									: "End Time"}
								<br />
								{dayjs(event?.endTime).isAfter(Date.now()) &&
									dayjs(event?.endTime).format(
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
					{event?.options?.map((option, index) => {
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
						{event?.options[0].description}
					</Button>
					<Button
						color="danger"
						variant={selectedOption === 1 ? "solid" : "light"}
						fullWidth
						onClick={() => {
							setSelectedOption(1);
						}}
					>
						{event?.options?.[1].description}
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
								event?.options?.[selectedOption ?? 0]
									.token as keyof typeof TOKEN_ICONS
							]
						}
						endContent={event?.options[selectedOption ?? 0].token}
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
			</CardBody>
			<Divider />
		</Card>
	);
}
