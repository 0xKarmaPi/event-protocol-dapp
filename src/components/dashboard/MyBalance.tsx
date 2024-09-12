import BorderGradient from "@/components/ui/BorderGradient";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import sol from "/public/assets/solana.png";
import eventTokenLogo from "/public/assets/logo.png";
import { useAnchor } from "@/hooks/useAnchor";
import { useCallback, useEffect, useState } from "react";
import { web3 } from "@coral-xyz/anchor";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { formatPrice } from "@/utils/common";
import { EVENT_TOKEN_DECIMAL } from "@/utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUserStore } from "@/stores/userStore";

export default function MyBalance() {
	const { program } = useAnchor();
	const { publicKey } = useWallet();
	const { network } = useUserStore();
	const [myBalance, setMyBalance] = useState({
		sol: 0,
		event: 0,
	});

	const fetchBalance = async () => {
		const solBalance = await program?.provider?.connection?.getBalance(
			program.provider.publicKey!,
		);
		try {
			// Fetch EVENT TOKEN balance
			const associatedToken = await getAssociatedTokenAddress(
				new web3.PublicKey(
					process.env.NEXT_PUBLIC_EVENT_TOKEN_MINT_ADDRESS!,
				),
				program.provider.publicKey!,
			);

			const account = await getAccount(
				program.provider.connection,
				associatedToken,
			);
			const eventTokenBalance =
				Number(account.amount) / EVENT_TOKEN_DECIMAL;

			return {
				sol: solBalance / web3.LAMPORTS_PER_SOL,
				event: eventTokenBalance,
			};
		} catch (error) {
			return {
				sol: solBalance / web3.LAMPORTS_PER_SOL,
				event: 0,
			};
		}
	};

	useEffect(() => {
		fetchBalance().then((balance) => setMyBalance(balance));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [publicKey, network]);

	return (
		<BorderGradient className="h-full rounded-lg p-0.5">
			<div className="rounded-lg bg-gradient-to-tr from-blue-900 to-purple-400 px-4 py-4">
				<p className="text-sm"> Your Balance</p>
				<p className="mt-4 flex items-baseline gap-2 text-4xl font-bold text-green-500">
					<Image src={sol} alt="" width={28} height={28} />{" "}
					{formatPrice(myBalance.sol)}{" "}
					<span className="text-base">SOL</span>
				</p>
				<br />
				<div className="flex items-center justify-between">
					<p className="flex items-baseline gap-2 text-4xl font-bold text-yellow-500">
						<Image
							src={eventTokenLogo}
							alt=""
							width={28}
							height={28}
							className="rounded-full"
						/>{" "}
						{formatPrice(myBalance.event)}{" "}
						<span className="text-base">$EVENT Token</span>
					</p>
					<Link
						href={process.env.NEXT_PUBLIC_IVO_APP_URL!}
						target="_blank"
					>
						<Button variant="faded" color="warning">
							Buy more
						</Button>
					</Link>
				</div>
			</div>
		</BorderGradient>
	);
}
