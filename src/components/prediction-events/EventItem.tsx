import { IEvent } from "@/types/event";
import { renderMintValue } from "@/utils/common";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Chip,
} from "@nextui-org/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

type EventItemProps = {
	event: IEvent;
};
export default function EventItem({ event }: EventItemProps) {
	const handleCopyBlink = () => {
		const blink = new URL(
			`/api/actions/vote?eventId=${event.id}`,
			window.location.origin,
		).toString();
		navigator.clipboard
			.writeText(blink)
			.then(() => {
				toast.success("Copied to clipboard");
			})
			.catch(() => {
				toast.error("Failed to copy");
			});
	};

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
	return (
		<Card key={event.id} className="h-full md:min-w-[150px]">
			<CardHeader>
				<div className="flex w-full items-start justify-between">
					<div className="flex items-center gap-2">
						<Image
							alt="logo"
							height={40}
							src={"/assets/logo.png"}
							width={40}
							className="rounded-full"
						/>
						<div className="flex flex-col">
							<p className="text-md text-primary">
								Eventprotocol
							</p>
						</div>
					</div>
					<div className="w-1/2 text-right text-xs">
						{renderStatusLabel(event)}
					</div>
				</div>
			</CardHeader>
			<CardBody className="mt-4 flex flex-col gap-3">
				<div className="w-full text-center text-xl">
					{event.description}
				</div>
			</CardBody>
			<CardFooter className="flex flex-col gap-4">
				<div className="mt-8 flex w-full justify-around">
					<div className="flex flex-col items-center gap-2">
						<div className="text-center text-sm font-semibold">
							Option A:
							<br />
							<span className="text-lg">
								{event.left_description}
							</span>
						</div>
						<div className="text-center text-sm opacity-60">
							Acceptable Vote Tick:{` `}
							{renderMintValue(event.left_mint)}
						</div>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="text-center text-sm font-semibold">
							Option B: <br />
							<span className="text-lg">
								{event.right_description}
							</span>
						</div>
						<div className="text-center text-sm opacity-60">
							Acceptable Vote Tick:{` `}
							{renderMintValue(event.right_mint)}
						</div>
					</div>
				</div>
				<div className="flex gap-1">
					<Link href={`/prediction-events/${event.id}`}>
						<Button className="bg-gradient-to-tr from-primary to-purple-400 text-white shadow-lg">
							View Detail
						</Button>
					</Link>
					<Button
						className="bg-gradient-to-tr from-primary to-purple-400 text-white shadow-lg"
						onPress={handleCopyBlink}
					>
						Copy Blink
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
