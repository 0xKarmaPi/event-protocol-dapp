"use client";

import EventItem from "./EventItem";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/services/event";
import { Card, Pagination, Skeleton } from "@nextui-org/react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 15;

export default function EventList() {
	const [page, setPage] = useState(1);
	const { data: events, isPending } = useQuery({
		queryKey: ["events", page],
		queryFn: () =>
			getEvents({
				limit: PAGE_SIZE,
				page,
			}),
	});
	const totalPages = useMemo(() => {
		return Math.ceil((events?.total || 0) / PAGE_SIZE);
	}, [events?.total]);

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
		<>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{events?.nodes?.map((event, index) => (
					<EventItem key={index} event={event} />
				))}
			</div>
			<div className="mt-4 flex justify-center">
				<Pagination
					onChange={setPage}
					page={page}
					total={totalPages}
					showControls
				/>
			</div>
		</>
	);
}
