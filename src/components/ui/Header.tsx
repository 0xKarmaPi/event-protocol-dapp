"use client";

import { Navbar, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import Logo from "./Logo";
import { NAV_BARS } from "@/utils/constants";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

export default function Header() {
	const pathname = usePathname();
	return (
		<Navbar className="bg-slate-800">
			<Logo />
			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
				{NAV_BARS.map((item) => (
					<NavbarItem key={item.name}>
						<Link
							className={clsx("text-foreground", {
								"!text-primary font-bold":
									pathname === item.path,
							})}
							href={item.path}
						>
							{item.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>
					<Button className="from-primary bg-gradient-to-tr to-purple-400 text-white">
						Connect Wallet
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
