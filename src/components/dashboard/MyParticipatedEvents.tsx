import { getEvents } from "@/services/event";
import { IEvent } from "@/types/event";
import { PAGE_SIZE_DEFAULT } from "@/utils/constants";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
	Chip,
	Pagination,
	Button,
} from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import ButtonClaimReward from "./ButtonClaimReward";
import { renderMintValue } from "@/utils/common";
import TooltipCorrectOption from "./TooltipCorrectOption";
import { web3 } from "@coral-xyz/anchor";
import ButtonWithdraw from "./ButtonWithdraw";
import Link from "next/link";

export default function MyParticipatedEvents() {
	const [page, setPage] = useState(1);
	const { publicKey } = useWallet();

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
			label: "OPTIONS & YOUR VOTE",
			align: "center",
		},
		{
			key: "status",
			label: "STATUS",
			align: "center",
		},
		{
			key: "result",
			label: "ACTION / RESULT",
			align: "center",
		},
	];

	const { data: participatedEvents, refetch } = useQuery({
		queryKey: ["participatedEvents", page, publicKey],
		queryFn: () =>
			getEvents({
				page: page,
				limit: PAGE_SIZE_DEFAULT,
				predictor: publicKey?.toString(),
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
					<Link
						href={`/prediction-events/${event.id}`}
						className="hover:text-primary"
					>
						<p className="w-[200px]">
							{event.description}
							<br />
							{event.burning && (
								<span className="text-xs italic text-danger">
									(*)All token will be burned if you predict
									wrong
								</span>
							)}
						</p>
					</Link>
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
							<p className="text-sm">
								Voted:{" "}
								{Number(
									event.tickets?.find(
										(ticket) => ticket.selection === "Left",
									)?.amount ?? 0,
								) /
									(event.left_mint_decimals
										? 10 ** event.left_mint_decimals
										: web3.LAMPORTS_PER_SOL)}{" "}
								{renderMintValue(event.left_mint)}
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
							<p className="text-sm">
								Voted:{" "}
								{Number(
									event.tickets?.find(
										(ticket) =>
											ticket.selection === "Right",
									)?.amount ?? 0,
								) /
									(event.right_mint_decimals
										? 10 ** event.right_mint_decimals
										: web3.LAMPORTS_PER_SOL)}{" "}
								{renderMintValue(event.right_mint)}
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
			case "result":
				if (event.result) {
					return (
						<div className="flex items-center gap-2">
							<ButtonWithdraw refetch={refetch} event={event} />
							<ButtonClaimReward
								refetch={refetch}
								event={event}
							/>
						</div>
					);
				}
				return <p>Waiting result</p>;
			default:
				return getKeyValue(event, columnKey);
		}
	};
	return (
		<Table
			aria-label="Example table with dynamic content"
			bottomContent={
				<div className="flex w-full justify-center">
					<Pagination
						isCompact
						showControls
						showShadow
						page={page}
						total={Math.ceil(
							(participatedEvents?.total ?? 0) /
								PAGE_SIZE_DEFAULT,
						)}
						onChange={(page) => setPage(page)}
					/>
				</div>
			}
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn align={column.align! as any} key={column.key}>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				items={participatedEvents?.nodes || []}
				emptyContent={"No rows to display."}
			>
				{(participatedEvents?.nodes ?? [])?.map((item, index) => (
					<TableRow key={index}>
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
