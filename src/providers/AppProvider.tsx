"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletContextProvider from "./WalletContextProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</SessionProvider>
		</NextUIProvider>
	);
}
