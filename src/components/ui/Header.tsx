"use client";

import {
	Button,
	Navbar,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@nextui-org/react";
import Logo from "./Logo";
import { NAV_BARS } from "@/utils/constants";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Header() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar
			className="bg-slate-800"
			onMenuOpenChange={setIsMenuOpen}
			isMenuOpen={isMenuOpen}
		>
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle
					className="text-white"
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				/>
				<Logo />
			</NavbarContent>
			<NavbarMenu className="z-50">
				{NAV_BARS.map((item) => (
					<NavbarMenuItem
						key={item.name}
						onClick={() => setIsMenuOpen(false)}
					>
						<Link
							className={clsx("text-foreground", {
								"font-bold !text-primary":
									pathname === item.path,
							})}
							href={item.path || "#"}
							target={item.target || "_self"}
						>
							{item.name}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
				<Logo />
				{NAV_BARS.map((item) => (
					<NavbarItem key={item.name}>
						<Link
							className={clsx("text-foreground", {
								"font-bold !text-primary":
									pathname === item.path,
							})}
							href={item.path || "#"}
							target={item.target || "_self"}
						>
							{item.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>
					<ConnectWalletButton />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
