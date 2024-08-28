"use client";

import BorderGradient from "@/components/ui/BorderGradient";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { GiTwoCoins } from "react-icons/gi";
import sol from "/public/assets/solana.png";
import MyEvents from "@/components/dashboard/MyEvents";
import { useSession } from "next-auth/react";

const statistics = [
	{
		label: "Total created",
		value: 10,
	},
	{
		label: "Total participated",
		value: 7,
	},
	{
		label: "Win",
		value: 5,
	},
	{
		label: "Lose",
		value: 2,
	},
];
export default function DashboardPage() {
	const session = useSession();

	if (!session.data?.user)
		return (
			<div className="mt-10 text-center text-foreground">
				Please connect your wallet!
			</div>
		);
	return (
		<section className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-6 py-8 text-foreground md:py-10">
			<div className="w-full">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="grid grid-cols-2 gap-4 md:grid-cols-2">
						{statistics.map((statistic, index) => (
							<BorderGradient
								key={index}
								className="rounded-lg p-0.5"
							>
								<div className="rounded-lg bg-gray-700 px-4 py-2">
									<p className="text-sm opacity-80">
										{" "}
										{statistic.label}
									</p>
									<p className="text-4xl font-bold">
										{statistic.value}{" "}
										<span className="text-base">
											events
										</span>
									</p>
								</div>
							</BorderGradient>
						))}
					</div>
					<BorderGradient className="h-full rounded-lg p-0.5">
						<div className="rounded-lg bg-gradient-to-tr from-blue-900 to-purple-400 px-4 py-4">
							<p className="text-sm"> Your Balance</p>
							<p className="mt-4 flex items-baseline gap-2 text-4xl font-bold text-green-500">
								<Image
									src={sol}
									alt=""
									width={28}
									height={28}
								/>{" "}
								{Number(123145.412412).toLocaleString("en")}{" "}
								<span className="text-base">SOL</span>
							</p>
							<br />
							<div className="flex items-center justify-between">
								<p className="flex items-baseline gap-2 text-4xl font-bold text-yellow-500">
									<GiTwoCoins className="text-3xl" />
									2000{" "}
									<span className="text-base">$EVENT</span>
								</p>
								<Link
									href={process.env.NEXT_PUBLIC_IVO_APP_URL!}
									target="_blank"
								>
									<Button variant="faded" color="warning">
										Buy more
									</Button>
								</Link>
							</div>
						</div>
					</BorderGradient>
				</div>
				<br />
				<MyEvents />
			</div>
		</section>
	);
}
