"use client";

import {
	Card,
	CardHeader,
	Divider,
	CardBody,
	Button,
	Input,
	CircularProgress,
	Chip,
	CardFooter,
} from "@nextui-org/react";
import dayjs from "dayjs";
import Image from "next/image";

export default function IVOPage() {
	const progressValue = 90;
	const isClient = true;
	const staticstics = [
		{
			name: "Total Supply",
			value: 10000,
		},
		{
			name: "Total Purchased",
			value: 412414,
		},
		{
			name: "Minimum IDO Amount",
			value: 3000000,
		},
		{
			name: "Max IDO",
			value: 10000000,
		},
	];

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="flex gap-3">
				<Card className="md:min-w-[600px]">
					<CardHeader className="flex justify-between">
						<div className="flex w-full gap-3">
							<Image
								alt="logo"
								height={40}
								src={"/assets/logo.png"}
								width={40}
								className="h-10 w-10 rounded-full"
							/>
							<div className="flex flex-col text-left">
								<p className="text-md text-primary">
									Eventprotocol IVO
								</p>
								<p className="text-small">Eventprotocol</p>
							</div>
						</div>
						<div className="flex flex-col items-end justify-end text-left">
							<Chip color="success" variant="light">
								From:{" "}
								{dayjs("2024-02-20T12:08:090").format(
									"MMM DD YYYY, h:mm:ss A",
								)}
							</Chip>
							<Chip color="danger" variant="light">
								To:{" "}
								{dayjs("2024-02-20T12:08:090").format(
									"MMM DD YYYY, h:mm:ss A",
								)}
							</Chip>
						</div>
					</CardHeader>
					<CardBody>
						<div className="flex w-full justify-center">
							<CircularProgress
								classNames={{
									svg: "w-[200px] h-[200px] drop-shadow-md",
									indicator: "!bg-[#132922]",

									track: "!bg-[#132922]",
									value: "text-3xl font-semibold",
								}}
								value={progressValue}
								strokeWidth={4}
								showValueLabel={true}
								label="IVO Progress"
							/>
						</div>
						<p>Statistics</p>
						<div className="grid w-full grid-cols-2 gap-2">
							{staticstics.map((value) => (
								<div
									key={value.name}
									className="rounded-lg border border-green-950 bg-gradient-to-r from-[#0a0f0e] to-[#132922] p-2 text-xs"
								>
									{value.name}
									<br />
									<span className="text-3xl">
										{value.value.toLocaleString("en-US")}
									</span>{" "}
									SOL
								</div>
							))}
						</div>
						<Divider className="mb-4 mt-4" />
						<div className="mb-2 flex justify-between">
							<p>Purchase amount</p>
							<div>
								<p className="flex items-center gap-2 text-right">
									Purchased amount: 500{" "}
									<Image
										src="/assets/solana.png"
										width={24}
										height={24}
										alt="SOl"
									/>{" "}
									SOL
								</p>
							</div>
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
								description="Minimum Purchase Amount: 100,000 SOL"
							/>
						</div>
					</CardBody>
					<CardFooter>
						<div className="flex w-full flex-row gap-2">
							{isClient && (
								<Button
									className="bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg"
									fullWidth
									onClick={() => {}}
								>
									Purchase
								</Button>
							)}
						</div>
					</CardFooter>
				</Card>
			</div>
		</section>
	);
}
