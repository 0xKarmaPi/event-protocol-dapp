import { getEvents } from "@/services/event";
import { IEvent } from "@/types/event";
import { renderMintValue } from "@/utils/common";
import { PAGE_SIZE_DEFAULT } from "@/utils/constants";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
	Pagination,
	Chip,
} from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import SetPredictionResultModal from "./SetPredictionResultModal";
import TooltipCorrectOption from "./TooltipCorrectOption";
import ButtonDeleteEvent from "./ButtonDeleteEvent";

export default function MyCreatedEvents() {
	const { publicKey } = useWallet();
	const [page, setPage] = useState(1);

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
			align: "center",
		},
		{
			key: "action",
			label: "ACTION / RESULT",
			align: "center",
		},
	];
	const { data: createdEvents, refetch } = useQuery({
		queryKey: ["createdEvents", page, publicKey],
		queryFn: () =>
			getEvents({
				page: page,
				limit: PAGE_SIZE_DEFAULT,
				creator: publicKey?.toString(),
			}),
		enabled: !!publicKey,
	});

	const renderStatusLabel = (event: IEvent) => {
		const now = dayjs();
		const startDate = dayjs(event.start_date);
		const endDate = dayjs(event.end_date);

		if (now.isBefore(startDate)) {
			return (
				<div className="text-gray-400">
					<Chip color="default">Upcomming</Chip>
					<p>
						From:{" "}
						{dayjs(event.start_date).format(
							"DD MMM YYYY - HH:mm A",
						)}
					</p>
					<p>
						To:{" "}
						{dayjs(event.end_date).format("DD MMM YYYY-HH:mm A")}
					</p>
				</div>
			);
		}
		if (now.isAfter(endDate)) {
			return (
				<div className="text-red-500">
					<Chip color="danger" variant="flat">
						Ended
					</Chip>
					<p>
						From:{" "}
						{dayjs(event.start_date).format("DD MMM YYYY-HH:mm A")}
					</p>
					<p>
						To:{" "}
						{dayjs(event.end_date).format("DD MMM YYYY-HH:mm A")}
					</p>
				</div>
			);
		}
		return (
			<div className="text-green-500">
				<Chip color="success">On going</Chip>
				<p>
					From:{" "}
					{dayjs(event.start_date).format("DD MMM YYYY-HH:mm A")}
				</p>
				<p>To: {dayjs(event.end_date).format("DD MMM YYYY-HH:mm A")}</p>
			</div>
		);
	};

	const renderCellValue = (
		event: IEvent,
		columnKey: string,
		index: number,
	) => {
		switch (columnKey) {
			case "index":
				return index + 1 + (page - 1) * PAGE_SIZE_DEFAULT;
			case "description":
				return (
					<p className="w-[200px]">
						{event.description}
						<br />
						{event.burning && (
							<span className="text-xs italic text-danger">
								(*)All token will be burned if player predict
								wrong
							</span>
						)}
					</p>
				);
			case "options":
				return (
					<div className="flex justify-center gap-2">
						<div
							className={clsx(
								{
									"rounded-lg border border-primary bg-gradient-to-tr from-blue-900 to-purple-500 text-white":
										event.result !== "Right",
								},
								"relative w-[150px] px-2 py-1",
							)}
						>
							<p>{event.left_description}</p>
							<p className="text-xs">
								Accept: {renderMintValue(event.left_mint)}
							</p>
							{event.result === "Left" && (
								<TooltipCorrectOption />
							)}
						</div>
						<div
							className={clsx(
								{
									"rounded-lg border border-primary bg-gradient-to-tr from-blue-900 to-purple-500 text-white":
										event.result !== "Left",
								},
								"relative w-[150px] px-2 py-1",
							)}
						>
							<p>{event.right_description}</p>
							<p className="text-xs">
								Accept: {renderMintValue(event.right_mint)}
							</p>
							{event.result === "Right" && (
								<TooltipCorrectOption />
							)}
						</div>
					</div>
				);

			case "status":
				return (
					<div className="w-[200px] text-right">
						{renderStatusLabel(event)}
					</div>
				);
			case "action":
				if (event.result)
					return (
						<p>
							Finished <br />
							{`${event.result} is correct`}
						</p>
					);
				if (dayjs(event.start_date).isAfter(Date.now()))
					return (
						<ButtonDeleteEvent event={event} refetch={refetch} />
					);
				if (dayjs(event.end_date).isBefore(Date.now()))
					return (
						<SetPredictionResultModal
							refetch={refetch}
							event={event}
						/>
					);
				return <></>;
			default:
				return getKeyValue(event, columnKey);
		}
	};

	return (
		<Table
			bottomContent={
				<div className="flex w-full justify-center">
					<Pagination
						isCompact
						showControls
						showShadow
						page={page}
						total={Math.ceil(
							(createdEvents?.total ?? 0) / PAGE_SIZE_DEFAULT,
						)}
						onChange={(page) => setPage(page)}
					/>
				</div>
			}
			aria-label="Example table with dynamic content"
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn align={column.align! as any} key={column.key}>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				items={createdEvents?.nodes || []}
				emptyContent={"No rows to display."}
			>
				{(createdEvents?.nodes ?? [])?.map((item, index) => (
					<TableRow key={item.id}>
						{(columnKey) => (
							<TableCell>
								{renderCellValue(
									item,
									columnKey.toString(),
									index,
								)}
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
