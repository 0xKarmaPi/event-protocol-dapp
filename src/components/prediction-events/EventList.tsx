import { IEvent } from "@/types/event";
import EventItem from "./EventItem";

const events: IEvent[] = [
	{
		id: "1",
		address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
		name: "Karma",
		description:
			"Description lorem text? Long text here Description lorem text? Long text here",
		start: "2022-10-01T00:00:00.000Z",
		end: "2024-10-01T00:00:00.000Z",
		options: [
			{
				id: "1",
				name: "Karma",
				description: "Karma",
				token: "Karma",
				address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
				amount: 100,
			},
			{
				id: "2",
				name: "Karma",
				description: "Karma",
				token: "Karma",
				address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
				amount: 100,
			},
		],
	},
	{
		id: "2",
		address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
		name: "Karma",
		description: "Karma",
		start: "2022-10-01T00:00:00.000Z",
		end: "2025-10-01T00:00:00.000Z",
		options: [
			{
				id: "1",
				name: "Karma",
				description: "Karma",
				token: "Karma",
				address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
				amount: 100,
			},
			{
				id: "2",
				name: "Karma",
				description: "Karma",
				token: "Karma",
				address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
				amount: 100,
			},
		],
	},
	{
		id: "3",
		address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
		name: "Karma",
		description: "Karma",
		start: "2022-10-01T00:00:00.000Z",
		end: "2022-10-01T00:00:00.000Z",
		options: [
			{
				id: "1",
				name: "Karma",
				description: "Karma",
				token: "Karma",
				address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
				amount: 100,
			},
			{
				id: "2",
				name: "Karma",
				description: "Karma",
				token: "Karma",
				address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
				amount: 100,
			},
		],
	},
];
export default function EventList() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			{events.map((event) => (
				<EventItem key={event.id} event={event} />
			))}
		</div>
	);
}
