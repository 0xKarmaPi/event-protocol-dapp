import EventItem from "./EventItem";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/services/event";
import { Card, Skeleton } from "@nextui-org/react";

export default function EventList() {
	const { data: events, isPending } = useQuery({
		queryKey: ["events"],
		queryFn: () =>
			getEvents({
				limit: 15,
				page: 1,
			}),
	});
	if (isPending)
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{Array(6)
					.fill(0)
					.map((_, index) => (
						<Card key={index} className="space-y-5 p-4" radius="lg">
							<Skeleton className="rounded-lg">
								<div className="h-32 rounded-lg bg-default-300"></div>
							</Skeleton>
							<div className="space-y-3">
								<Skeleton className="w-3/5 rounded-lg">
									<div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
								</Skeleton>
								<Skeleton className="w-4/5 rounded-lg">
									<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
								</Skeleton>
								<Skeleton className="w-2/5 rounded-lg">
									<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
								</Skeleton>
							</div>
						</Card>
					))}
			</div>
		);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{events?.list.map((event) => (
				<EventItem key={event.id} event={event} />
			))}
		</div>
	);
}
