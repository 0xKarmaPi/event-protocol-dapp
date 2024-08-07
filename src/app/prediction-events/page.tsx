"use client";

import EventList from "@/components/prediction-events/EventList";
import { Tab, Tabs } from "@nextui-org/react";

export default function PredictionEventsPage() {
	return (
		<div className="w-full">
			<Tabs color="primary">
				<Tab title="Terminal" key={"terminal"}>
					<EventList />
				</Tab>
				<Tab title="For you" key="for-you">
					<p className="text-white">Coming soon</p>
				</Tab>
			</Tabs>
		</div>
	);
}
