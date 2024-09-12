"use client";

import EventDetailForm from "@/components/prediction-events/EventDetailForm";
import { getEvent } from "@/services/event";
import { useUserStore } from "@/stores/userStore";
import { useQuery } from "@tanstack/react-query";

export default function EventDetail({ params }: { params: { id: string } }) {
	const { network } = useUserStore();

	const {
		data: event,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["event", network],
		queryFn: () => getEvent(params.id!, network),
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
