"use client";

import EventDetailForm from "@/components/prediction-events/EventDetailForm";
import { getEvents } from "@/services/event";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	// Get first event from list
	const {
		data: events,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["events"],
		queryFn: () =>
			getEvents({
				limit: 1,
				page: 1,
			}),
	});

	return (
		<section className="mx-auto flex w-[90%] flex-col items-center justify-center gap-4 py-8 md:py-10">
			<EventDetailForm
				event={events?.nodes?.[0]}
				isPending={isPending}
				isError={isError}
			/>
		</section>
	);
}
