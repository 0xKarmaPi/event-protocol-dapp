import { getStatistics } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import BorderGradient from "../ui/BorderGradient";

export default function MyStatistics() {
	const { data: statistics, isLoading } = useQuery({
		queryKey: ["statistics"],
		queryFn: getStatistics,
	});

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-2">
			<BorderGradient className="rounded-lg p-0.5">
				<div className="rounded-lg bg-gray-700 px-4 py-2">
					<p className="text-sm opacity-80"> Total created</p>
					<p className="text-4xl font-bold">
						{statistics?.total_created ?? 0}{" "}
						<span className="text-base">events</span>
					</p>
				</div>
			</BorderGradient>
			<BorderGradient className="rounded-lg p-0.5">
				<div className="rounded-lg bg-gray-700 px-4 py-2">
					<p className="text-sm opacity-80"> Total participated</p>
					<p className="text-4xl font-bold">
						{statistics?.total_participated ?? 0}{" "}
						<span className="text-base">events</span>
					</p>
				</div>
			</BorderGradient>
			<BorderGradient className="rounded-lg p-0.5">
				<div className="rounded-lg bg-gray-700 px-4 py-2">
					<p className="text-sm opacity-80"> Win</p>
					<p className="text-4xl font-bold">
						{statistics?.total_win ?? 0}{" "}
						<span className="text-base">events</span>
					</p>
				</div>
			</BorderGradient>
			<BorderGradient className="rounded-lg p-0.5">
				<div className="rounded-lg bg-gray-700 px-4 py-2">
					<p className="text-sm opacity-80"> Lose</p>
					<p className="text-4xl font-bold">
						{statistics?.total_lose ?? 0}{" "}
						<span className="text-base">events</span>
					</p>
				</div>
			</BorderGradient>
		</div>
	);
}
