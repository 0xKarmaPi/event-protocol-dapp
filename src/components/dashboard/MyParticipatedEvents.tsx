import { IEvent } from "@/types/event";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
} from "@nextui-org/react";
import clsx from "clsx";
import dayjs from "dayjs";

const rows: IEvent[] = [
	{
		description: "Real Madrid win the UEFA Super cup 2024?",
		endTime: "2025-01-01T00:00:00.000Z",
		id: "1",
		options: [
			{
				description: "Option 1",
				id: "1",
				token: "CUSTOM",
				address: "0x123",
				selected: true,
				amount: 200,
			},
			{
				description: "Option 2",
				id: "2",
				token: "SOL",
				address: "0x123",
			},
		],
		address: "0x123",
		author: {
			address: "0x123",
			username: "User 1",
		},
	},
	{
		description: "Real Madrid win the UEFA Super cup 2024?",
		endTime: "2022-01-01T00:00:00.000Z",
		id: "2",
		options: [
			{
				description: "Yes",
				id: "1",
				token: "RAY",
				address: "0x123",
				selected: true,
				amount: 1000,
			},
			{
				description: "No",
				id: "2",
				token: "SOL",
				address: "0x123",
			},
		],
		address: "0x123",
		author: {
			address: "0x123",
			username: "User 1",
		},
		result: "WIN",
	},
	{
		description: "Will China Win?",
		endTime: "2022-01-01T00:00:00.000Z",
		id: "3",
		options: [
			{
				description: "Yes",
				id: "1",
				token: "RAY",
				address: "0x123",
			},
			{
				description: "No",
				id: "2",
				token: "SOL",
				address: "0x123",
				selected: true,
				amount: 200,
			},
		],
		address: "0x123",
		author: {
			address: "0x123",
			username: "User 1",
		},
		result: "LOSE",
	},
];
export default function MyParticipatedEvents() {
	const columns = [
		{
			key: "index",
			label: "NO.",
		},
		{
			key: "description",
			label: "DESCRIPTION",
		},

		{
			key: "options",
			label: "OPTIONS",
			align: "center",
		},
		{
			key: "status",
			label: "STATUS",
			align: "end",
		},
		{
			key: "result",
			label: "RESULT",
			align: "center",
		},
	];

	const renderCellValue = (event: IEvent, columnKey: string) => {
		switch (columnKey) {
			case "index":
				return event.id;
			case "description":
				return <p className="w-[300px]">{event.description}</p>;
			case "options":
				return (
					<div className="flex min-w-[200px] justify-center gap-4">
						{event?.options?.map((option) => (
							<div
								key={option.id}
								className={clsx(
									{
										"rounded-lg border border-primary bg-gradient-to-tr from-blue-900 to-purple-500 text-white":
											option.selected,
										"opacity-40": !option.selected,
									},
									"min-w-[100px] px-2 py-1",
								)}
							>
								<p>{option.description}</p>
								<p className="text-xs">
									{option.amount} {option.token}
								</p>
							</div>
						))}
					</div>
				);

			case "status":
				if (dayjs(event.endTime).isBefore(Date.now()))
					return (
						<div className="w-[200px] text-right text-red-500">
							<p>Ended</p>
							{dayjs(event.endTime).format(
								"DD/MM/YYYY - HH:mm A",
							)}
						</div>
					);
				return (
					<div className="w-[200px] text-right text-green-500">
						<p>Ongoing</p>
						{dayjs(event.endTime).format("DD/MM/YYYY - HH:mm A")}
					</div>
				);
			case "result":
				return (
					<p
						className={clsx({
							"text-red-500": event.result === "LOSE",
							"text-green-500": event.result === "WIN",
						})}
					>
						{event.result}
					</p>
				);
			default:
				return getKeyValue(event, columnKey);
		}
	};
	return (
		<Table aria-label="Example table with dynamic content">
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn align={column.align! as any} key={column.key}>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={rows} emptyContent={"No rows to display."}>
				{(item) => (
					<TableRow key={item.id}>
						{(columnKey) => (
							<TableCell>
								{renderCellValue(item, columnKey.toString())}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
