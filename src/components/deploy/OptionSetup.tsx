"use client";

import { useState } from "react";
import sol from "/public/assets/solana.png";
import jup from "/public/assets/jupiter.png";
import raydium from "/public/assets/raydium.webp";
import Image from "next/image";
import { Input, useDisclosure } from "@nextui-org/react";
import { shortAddress } from "@/utils/common";
import SelectTokenModal from "./SelectTokenModal";

export type TokenOption = {
	name: string;
	value: string;
	icon: React.ReactNode;
	address: string;
	balance: number;
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
		name: "Jupiter",
		value: "JUP",
		icon: <Image src={jup} alt="Jupiter" width={32} height={32} />,
		address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
		balance: 500,
	},
	{
		name: "Raydium",
		value: "RAY",
		icon: <Image src={raydium} alt="Raydium" width={32} height={32} />,
		address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
		balance: 100,
	},
];
export default function OptionSetup({ optionName }: { optionName: string }) {
	const [type, setType] = useState(TOKENS[1]);
	const [description, setDescription] = useState("");
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const onChangeType = (type: TokenOption) => {
		setType(type);
	};
	return (
		<>
			<div>
				<p className="text-left">{optionName}</p>
				<div className="flex gap-2">
					<Input
						type="number"
						className="flex-1"
						label="Amount"
						min={0}
					/>
					<div
						className="mb-2 flex flex-1 cursor-pointer items-center justify-between rounded-xl bg-[#27272A] px-3 py-2"
						onClick={onOpen}
					>
						<div className="flex gap-1">
							<div className="h-fit rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
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
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
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
