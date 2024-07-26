"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextUIProvider>
			<SessionProvider>
				<main>{children}</main>
			</SessionProvider>
		</NextUIProvider>
	);
}
