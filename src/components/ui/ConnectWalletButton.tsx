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
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { shortAddress } from "@/utils/common";
import Image from "next/image";
import sol from "/public/assets/solana.png";
import nightly from "/public/assets/nightly.png";
import phantom from "/public/assets/phantom-icon.png";
import sonic from "/public/assets/sonic.png";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { COOKIES } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useUserStore } from "@/stores/userStore";

export default function ConnectWalletButton() {
	const session = useSession();
	const router = useRouter();
	const { signMessage, publicKey, connected, disconnect } = useWallet();
	const modalSelectWallet = useWalletModal();
	const { updateNetwork, network } = useUserStore();

	const mutateSignIn = useMutation({
		mutationFn: signInService,
		mutationKey: ["signIn"],
		onSuccess: async (data) => {
			signIn("credentials", {
				username: publicKey?.toString()!,
				address: publicKey?.toString()!,
				id: publicKey?.toString()!,
				redirect: true,
			});
			setCookie(COOKIES.ACCESSTOKEN, data.access_token, {
				maxAge: 12 * 60 * 60,
			});
			toast("Connected successfully", { type: "success" });
		},
		onError: () => {
			toast("Failed to connect", { type: "error" });
			disconnect();
		},
	});

	const mutateGeneratePayload = useMutation({
		mutationFn: generatePayload,
		onSuccess: async (data) => {
			const encodedMessage = new TextEncoder().encode(data);
			const signed_message = await signMessage?.(encodedMessage);

			mutateSignIn.mutate({
				address: publicKey?.toBase58()!,
				message: data,
				signed_message: Buffer.from(signed_message!).toString("hex"),
			});
		},
		onError: () => {
			toast("Failed to connect", { type: "error" });
			disconnect();
		},
	});

	const handleDisconnect = useCallback(() => {
		disconnect();
		signOut();
		deleteCookie(COOKIES.ACCESSTOKEN);
	}, [disconnect]);

	const handleClickProfile = () => {
		router.push("/profile");
	};

	const handleClickConnectWallet = async () => {
		modalSelectWallet.setVisible(true);
	};

	const renderIconWallet = useMemo(() => {
		if (connected) {
			const selectedWallet = localStorage?.getItem("walletName");
			switch (selectedWallet?.toLowerCase()) {
				case `"phantom"`:
					return (
						<Image src={phantom} alt="sol" width={20} height={20} />
					);
				case `"nightly"`:
					return (
						<Image
							src={nightly}
							alt="nightly"
							width={20}
							height={20}
							className="rounded-full"
						/>
					);
			}
		}
	}, [connected]);

	const renderIconNetwork = useMemo(() => {
		if (connected) {
			switch (network) {
				case "solana":
					return (
						<div className="flex items-center gap-1">
							<Image
								src={sol}
								alt="sol"
								width={20}
								height={20}
								className="hidden rounded-full md:block"
							/>
							<span>Solana</span>
						</div>
					);
				case "sonic":
					return (
						<div className="flex items-center gap-1">
							<Image
								src={sonic}
								alt="sonic"
								width={20}
								height={20}
								className="hidden rounded-full md:block"
							/>
							<span>Sonic</span>
						</div>
					);
			}
		}
	}, [connected, network]);

	useEffect(() => {
		if (publicKey && connected) {
			const accessToken = getCookie(COOKIES.ACCESSTOKEN);

			if (!accessToken) {
				mutateGeneratePayload.mutate(publicKey.toString());
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [publicKey, connected]);

	if (session.data?.user) {
		return (
			<div className="flex items-center gap-2">
				{/* Select Network */}
				<Dropdown className="!w-[100px] text-white">
					<DropdownTrigger>
						<Button
							className="bg-white/90 text-black"
							startContent={
								<div className="flex items-center gap-1">
									{renderIconNetwork}
								</div>
							}
						></Button>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownItem
							onClick={() => updateNetwork("solana")}
							key="solana"
							startContent={
								<Image
									src={sol}
									alt="sol"
									width={20}
									height={20}
									className="rounded-full"
								/>
							}
						>
							Solana
						</DropdownItem>
						<DropdownItem
							key="sonic"
							onClick={() => updateNetwork("sonic")}
							startContent={
								<Image
									src={sonic}
									alt="sonic"
									width={20}
									height={20}
									className="rounded-full"
								/>
							}
						>
							Sonic
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>

				{/* Account Info */}
				<Dropdown className="text-white">
					<DropdownTrigger>
						<Button
							className="bg-white/90 text-black"
							startContent={
								<div className="flex items-center gap-1">
									{renderIconWallet}
								</div>
							}
						>
							{shortAddress(publicKey?.toString()!)}
						</Button>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownItem
							onClick={handleClickProfile}
							key="myProfile"
							startContent={<FiUser />}
						>
							My Profile
						</DropdownItem>
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
			</div>
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
