import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import AppProvider from "@/providers/AppProvider";
import cx from "clsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Eventprotocol",
	description: "Eventprotocol dApp Open Source",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cx(
					inter.className,
					"min-h-screen bg-gradient-to-tr from-slate-800 via-default-200 to-blue-950 font-sans antialiased dark",
				)}
			>
				<ToastContainer theme="light" />
				<AppProvider>
					<Header />
					{children}
				</AppProvider>
			</body>
		</html>
	);
}
