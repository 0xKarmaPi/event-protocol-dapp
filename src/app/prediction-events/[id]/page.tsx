"use client";

import EventDetailForm from "@/components/prediction-events/EventDetailForm";
import { getEvent } from "@/services/event";
import { useQuery } from "@tanstack/react-query";

export default function EventDetail({ params }: { params: { id: string } }) {
	const {
		data: event,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["event"],
		queryFn: () => getEvent(params.id!),
		enabled: !!params.id,
	});

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4 md:py-10">
			<EventDetailForm
				event={event}
				isPending={isPending}
				isError={isError}
			/>
		</div>
	);
}
