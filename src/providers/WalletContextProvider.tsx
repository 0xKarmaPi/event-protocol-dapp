import { FC, ReactNode, useMemo } from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	PhantomWalletAdapter,
	NightlyWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { web3 } from "@coral-xyz/anchor";
import { useUserStore } from "@/stores/userStore";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const wallets = useMemo(
		() => [new PhantomWalletAdapter(), new NightlyWalletAdapter()],
		[],
	);

	const { network } = useUserStore();
	const endpoint = useMemo(() => {
		switch (network) {
			case "solana":
				return web3.clusterApiUrl("devnet");
			case "sonic":
				return "https://devnet.sonic.game";
			default:
				return web3.clusterApiUrl("devnet");
		}
	}, [network]);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default WalletContextProvider;
