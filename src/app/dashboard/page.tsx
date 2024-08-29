"use client";

import MyEvents from "@/components/dashboard/MyEvents";
import { useSession } from "next-auth/react";
import MyStatistics from "@/components/dashboard/MyStatistics";
import MyBalance from "@/components/dashboard/MyBalance";

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
					<MyStatistics />
					<MyBalance />
				</div>
				<br />
				<MyEvents />
			</div>
		</section>
	);
}
