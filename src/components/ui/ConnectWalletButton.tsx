"use client";

import { generatePayload, signIn as signInService } from "@/services/auth";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import bs58 from "bs58";
import { toast } from "react-toastify";
import { shortAddress } from "@/utils/common";
import Image from "next/image";
import sol from "/public/assets/solana.png";
import phantom from "/public/assets/phantom-icon.png";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { deleteCookie, setCookie } from "cookies-next";
import { COOKIES } from "@/utils/constants";

export default function ConnectWalletButton() {
	const [connecting, setConnecting] = useState(false);
	const session = useSession();

	const getProvider = () => {
		if ("phantom" in window) {
			const provider = (window.phantom as any).solana;

			if (provider?.isPhantom) {
				return provider;
			}
		}
		window.open("https://phantom.app/", "_blank");
	};

	const mutateSignIn = useMutation({
		mutationFn: signInService,
		mutationKey: ["signIn"],
		onSuccess: async (data, variables) => {
			console.log(data);
			toast("Connected successfully", { type: "success" });
			signIn("credentials", {
				username: data.user.username,
				address: data.user.address,
				id: data.user.id,
			});
			setCookie(COOKIES.ACCESSTOKEN, data.accessToken);
		},
		onError: (error) => {
			console.log(error);
			toast("Failed to connect", { type: "error" });
		},
	});

	const mutateGeneratePayload = useMutation({
		mutationFn: generatePayload,
		onSuccess: async (data) => {
			const provider = getProvider(); // see "Detecting the Provider"
			const encodedMessage = new TextEncoder().encode(data);
			const { signature, publicKey } = (await provider?.signMessage(
				encodedMessage,
				"utf8",
			)) as any;

			mutateSignIn.mutate({
				address: publicKey.toBase58(),
				signature: bs58.encode(signature),
				proof: data,
			});
		},
	});

	const handleDisconnect = useCallback(() => {
		const provider = getProvider();
		provider?.disconnect();
		signOut({ callbackUrl: "/" });
		deleteCookie(COOKIES.ACCESSTOKEN);
	}, []);

	const handleClickConnectWallet = useCallback(async () => {
		const provider = getProvider(); // see "Detecting the Provider"
		const res = await provider?.connect();

		if (res?.publicKey) {
			mutateGeneratePayload.mutate(res?.publicKey.toString());
		}
	}, []);

	if (session?.data?.user) {
		return (
			<Dropdown className="text-white">
				<DropdownTrigger>
					<Button
						className="bg-white/90 text-black"
						startContent={
							<div className="flex items-center gap-1">
								<Image
									src={sol}
									alt="sol"
									width={20}
									height={20}
								/>{" "}
								<span className="text-xs">Solana</span>
								<Image
									src={phantom}
									alt="sol"
									width={20}
									height={20}
								/>{" "}
							</div>
						}
					>
						{shortAddress(session?.data?.user?.email)}
					</Button>
				</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem
						onClick={handleDisconnect}
						key="disconnect"
						className="text-danger"
						color="danger"
						startContent={<FiLogOut />}
					>
						Disconnect
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	}

	return (
		<Button
			isLoading={
				mutateGeneratePayload.isPending || mutateSignIn.isPending
			}
			onClick={handleClickConnectWallet}
			className="bg-gradient-to-tr from-primary to-purple-400 text-white"
		>
			Connect Wallet
		</Button>
	);
}
