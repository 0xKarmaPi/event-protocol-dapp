"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet } from "viem/chains";

const config = createConfig({
	chains: [mainnet],
	multiInjectedProviderDiscovery: false,
	transports: {
		[mainnet.id]: http(),
	},
});

const queryClient = new QueryClient();

export default function DynamicProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DynamicContextProvider
			settings={{
				environmentId:
					process.env.DYNAMIC_ENVIROMENT_ID ||
					"d9aa4ce3-bcd5-424c-ac6c-29d5eadcb949",
				walletConnectors: [SolanaWalletConnectors],
			}}
		>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<DynamicWagmiConnector>{children}</DynamicWagmiConnector>
				</QueryClientProvider>
			</WagmiProvider>
		</DynamicContextProvider>
	);
}
