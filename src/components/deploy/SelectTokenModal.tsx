import { shortAddress } from "@/utils/common";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	LinkIcon,
	Divider,
	Button,
	ModalFooter,
	Input,
} from "@nextui-org/react";
import { TokenOption, TOKENS } from "./OptionSetup";
import { useCallback, useState } from "react";
import { GiTwoCoins } from "react-icons/gi";

type SelectTokenModalProps = {
	isOpen: boolean;
	onOpenChange: () => void;
	// eslint-disable-next-line no-unused-vars
	onChangeType: (token: TokenOption) => void;
};

export default function SelectTokenModal({
	isOpen,
	onOpenChange,
	onChangeType,
}: SelectTokenModalProps) {
	const [customToken, setCustomToken] = useState("");
	const [errorCustomToken, setErrorCustomToken] = useState(false);

	const handleConfirmCustomToken = useCallback(
		(onClose: () => void) => {
			if (!customToken) {
				setErrorCustomToken(true);
				return;
			}

			onChangeType({
				value: "CUSTOM",
				name: "CUSTOM",
				address: customToken,
				icon: (
					<div className="flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
						<GiTwoCoins className="h-6 w-6 text-yellow-400" />
					</div>
				),
			});
			onClose();
			setCustomToken("");
		},
		[customToken, onChangeType],
	);

	return (
		<Modal
			className="text-foreground"
			isOpen={isOpen}
			title="Select a token"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => {
					return (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Select a token
							</ModalHeader>
							<ModalBody>
								<div className="flex justify-between text-xs">
									<span>Token</span>
									<span>Balance/Address</span>
								</div>
								{TOKENS.map((token) => {
									return (
										<div
											key={token.name}
											className="mb-2 flex w-full cursor-pointer items-center justify-between gap-1 rounded-xl bg-[#27272A] px-3 py-2 text-foreground hover:opacity-80"
											onClick={() => {
												onChangeType(token);
												onClose();
											}}
										>
											<div className="flex gap-1">
												<div className="aspect-square h-[34px] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
													{token.icon}
												</div>
												<div>
													<p>{token.value}</p>
													<p className="text-xs">
														{token.name}
													</p>
												</div>
											</div>

											<div className="text-right">
												<p>{token.balance}</p>
												<p className="flex text-xs">
													{shortAddress(
														token.address,
													)}
													<LinkIcon />
												</p>
											</div>
										</div>
									);
								})}
								<div className="flex items-center justify-center gap-2">
									<Divider className="w-1/3" />
									<p className="text-xs">or</p>
									<Divider className="w-1/3" />
								</div>
								<p className="text-xs">Custom Token</p>
								<div className="flex items-start gap-3">
									<div className="flex-1">
										<Input
											errorMessage="Please enter a valid address"
											isInvalid={errorCustomToken}
											type="text"
											placeholder="Address: 0x..."
											className="w-full"
											value={customToken}
											onChange={(e) => {
												setErrorCustomToken(false);
												setCustomToken(e.target.value);
											}}
										/>
									</div>
									<Button
										onClick={() =>
											handleConfirmCustomToken(onClose)
										}
										className="bg-blue-500"
									>
										Confirm
									</Button>
								</div>
							</ModalBody>
							<ModalFooter></ModalFooter>
						</>
					);
				}}
			</ModalContent>
		</Modal>
	);
}
