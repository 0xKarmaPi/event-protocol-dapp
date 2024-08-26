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
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { shortAddress } from "@/utils/common";
import Image from "next/image";
import sol from "/public/assets/solana.png";
import phantom from "/public/assets/phantom-icon.png";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { deleteCookie, setCookie } from "cookies-next";
import { COOKIES } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWalletButton() {
	const session = useSession();
	const router = useRouter();
	const { signMessage, publicKey, connected, disconnect } = useWallet();

	const mutateSignIn = useMutation({
		mutationFn: signInService,
		mutationKey: ["signIn"],
		onSuccess: async (data) => {
			signIn("credentials", {
				username: publicKey?.toString()!,
				address: publicKey?.toString()!,
				id: publicKey?.toString()!,
				redirect: false,
			});
			setCookie(COOKIES.ACCESSTOKEN, data.accessToken);
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
		// signOut({ callbackUrl: "/" });
		deleteCookie(COOKIES.ACCESSTOKEN);
	}, [disconnect]);

	const handleClickProfile = () => {
		router.push("/profile");
	};

	// useEffect(() => {
	// 	console.log(session?.data?.user?.email, publicKey?.toString());
	// 	if (connected && session?.data?.user?.email === undefined) {
	// 		mutateGeneratePayload.mutate(publicKey?.toString()!);
	// 	}
	// }, [connected]);

	if (connected) {
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
		);
	}

	return <WalletMultiButton />;
}
