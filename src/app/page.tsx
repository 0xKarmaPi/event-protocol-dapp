"use client";

import { shortAddress } from "@/utils/common";
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
import sol from "/public/assets/solana.png";
import jup from "/public/assets/jupiter.png";
import raydium from "/public/assets/raydium.webp";
import { IEvent } from "@/types/event";
import cx from "clsx";

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
export default function Home() {
	return (
		<section className="mx-auto flex w-[90%] flex-col items-center justify-center gap-4 py-8 md:py-10">
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

					<div className="mt-8 flex w-full justify-around">
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
										<div className="flex gap-1">
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
					<div className="flex justify-between">
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
								<Image
									src="/assets/solana.png"
									width={24}
									height={24}
									alt="SOl"
									className="h-8 w-8"
								/>
							}
							endContent={"SOL"}
							type="number"
							placeholder="0"
							min={0}
							labelPlacement="outside"
						/>
					</div>
					<div className="flex w-full flex-row gap-2">
						<Button
							color="success"
							variant="flat"
							fullWidth
							onClick={() => {}}
						>
							{event.options[0].description}
						</Button>
						<Button
							color="danger"
							variant="flat"
							fullWidth
							onClick={() => {}}
						>
							{event.options[1].description}
						</Button>
					</div>
					<div className="flex w-full flex-row gap-2">
						<Button
							variant="bordered"
							color="warning"
							fullWidth
							onClick={() => {}}
						>
							🏆 Claim Reward
						</Button>
					</div>
				</CardBody>
				<Divider />
			</Card>
		</section>
	);
}
