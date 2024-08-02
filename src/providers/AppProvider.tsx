"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import DynamicProvider from "./DynamicProvider";

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DynamicProvider>
			<NextUIProvider locale="en-US">
				<SessionProvider>
					<main>{children}</main>
				</SessionProvider>
			</NextUIProvider>
		</DynamicProvider>
	);
}
