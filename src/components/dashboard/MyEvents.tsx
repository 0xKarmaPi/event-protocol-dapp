"use client";

import { Tabs, Tab } from "@nextui-org/react";
import MyCreatedEvents from "./MyCreatedEvents";
import MyParticipatedEvents from "./MyParticipatedEvents";

export default function MyEvents() {
	return (
		<Tabs aria-label="My Events" color="primary">
			<Tab key="created" title="My Created Events">
				<MyCreatedEvents />
			</Tab>
			<Tab key="participated" title="My Participated Events">
				<MyParticipatedEvents />
			</Tab>
		</Tabs>
	);
}
