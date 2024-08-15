import Image from "next/image";
import logo from "/public/assets/logo.png";
import { NavbarBrand } from "@nextui-org/react";
import Link from "next/link";

export default function Logo() {
	return (
		<Link href={"/"}>
			<NavbarBrand>
				<Image
					alt="Event Protocol"
					src={logo}
					width={32}
					className="rounded-full"
				/>
			</NavbarBrand>
		</Link>
	);
}
