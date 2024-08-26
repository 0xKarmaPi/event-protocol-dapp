"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletContextProvider from "./WalletContextProvider";

export const queryClient = new QueryClient();

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextUIProvider locale="en-US">
			<SessionProvider>
				<QueryClientProvider client={queryClient}>
					<WalletContextProvider>
						<main>{children}</main>
					</WalletContextProvider>
				</QueryClientProvider>
			</SessionProvider>
		</NextUIProvider>
	);
}
