"use client";

import { useState } from "react";
import sol from "/public/assets/solana.png";
import eventTokenLogo from "/public/assets/logo.png";
import Image from "next/image";
import { Input, useDisclosure } from "@nextui-org/react";
import { shortAddress } from "@/utils/common";
import SelectTokenModal from "./SelectTokenModal";
import { useDeployEventStore } from "@/stores/deployEventStore";
import { web3 } from "@coral-xyz/anchor";

export type TokenOption = {
	name?: string;
	value?: string;
	icon?: React.ReactNode;
	address: string;
	balance?: number;
};
export const TOKENS: TokenOption[] = [
	{
		name: "Solana",
		value: "SOL",
		icon: <Image src={sol} alt="Solana" width={32} height={32} />,
		address: "11111111111111111111111111111111",
		balance: 1000,
	},
	{
		name: "Event Token",
		value: "EVENT",
		icon: (
			<Image
				src={eventTokenLogo}
				alt="Event Token"
				width={32}
				height={32}
				className="rounded-full"
			/>
		),
		address: process.env.NEXT_PUBLIC_EVENT_TOKEN_MINT_ADDRESS!,
		balance: 1000,
	},
	// {
	// 	name: "Jupiter",
	// 	value: "JUP",
	// 	icon: <Image src={jup} alt="Jupiter" width={32} height={32} />,
	// 	address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
	// 	balance: 500,
	// },
	// {
	// 	name: "Raydium",
	// 	value: "RAY",
	// 	icon: <Image src={raydium} alt="Raydium" width={32} height={32} />,
	// 	address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
	// 	balance: 100,
	// },
];
export default function OptionSetup({
	optionName,
	isLeft,
}: {
	optionName: string;
	isLeft?: boolean;
}) {
	const [type, setType] = useState(TOKENS[0]);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		leftDescription,
		rightDescription,
		updateLeftDescription,
		updateRightDescription,
		updateLeftMint,
		updateRightMint,
	} = useDeployEventStore();
	const onChangeType = (type: TokenOption) => {
		setType(type);
		if (type.value !== "SOL") {
			if (isLeft) {
				updateLeftMint(new web3.PublicKey(type.address));
			} else {
				updateRightMint(new web3.PublicKey(type.address));
			}
		} else {
			if (isLeft) {
				updateLeftMint(null);
			} else {
				updateRightMint(null);
			}
		}
	};
	return (
		<>
			<div>
				<p className="text-left">{optionName}</p>
				<div className="flex gap-2">
					<div
						className="mb-2 flex flex-1 cursor-pointer items-center justify-between rounded-xl bg-[#27272A] px-3 py-2"
						onClick={onOpen}
					>
						<div className="flex gap-1">
							<div className="h-fit rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
								{type.icon}
							</div>
							<div className="text-left">
								<p>{type.value}</p>
								<p className="text-[10px]">
									{shortAddress(type.address)}
								</p>
							</div>
						</div>
					</div>
				</div>

				<Input
					type="text"
					label="Description"
					value={isLeft ? leftDescription : rightDescription}
					onChange={(e: any) => {
						if (isLeft) updateLeftDescription(e.target.value);
						else updateRightDescription(e.target.value);
					}}
				/>
			</div>
			<SelectTokenModal
				onChangeType={onChangeType}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>
		</>
	);
}
