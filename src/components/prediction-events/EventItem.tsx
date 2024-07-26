import { IEvent } from "@/types/event";
import { shortAddress } from "@/utils/common";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
} from "@nextui-org/react";
import dayjs from "dayjs";
import Image from "next/image";
import cx from "clsx";
import Link from "next/link";

type EventItemProps = {
	event: IEvent;
};
export default function EventItem({ event }: EventItemProps) {
	return (
		<Card key={event.id} className="h-full md:min-w-[150px]">
			<CardHeader>
				<div className="flex w-full items-start justify-between">
					<div className="flex items-center gap-2">
						<Image
							alt="logo"
							height={40}
							src={"/assets/logo.jpg"}
							width={40}
							className="rounded-full"
						/>
						<div className="flex flex-col">
							<p className="text-md text-primary">
								Eventprotocol
							</p>
							<p className="text-xs">
								{shortAddress(event.address)}
							</p>
						</div>
					</div>
					<div className="w-1/2 text-right text-xs">
						<p
							className={cx(
								"text-xs",
								dayjs(Number(event.end)).isBefore(Date.now())
									? "text-red-500"
									: "text-green-500",
							)}
						>
							{dayjs(Number(event.end)).isBefore(Date.now())
								? "Ended"
								: "End Time"}
							<br />
							{dayjs(Number(event.end)).isAfter(Date.now()) &&
								dayjs(Number(event.end)).format(
									"YYYY-MM-DD HH:mm:ss UTC Z",
								)}
						</p>
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
						<div className="text-left text-lg font-semibold">
							Option A:{` `}
							{event.name}
						</div>
						<div className="text-sm opacity-60">
							Acceptable Vote Tick:{` `}
							SOL
						</div>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="text-lg font-semibold">
							Option B: {event.name}
						</div>
						<div className="text-sm opacity-60">
							Acceptable Vote Tick:{` `}
							SOL
						</div>
					</div>
				</div>
				<Link href={`/prediction-events/${event.id}`}>
					<Button className="from-primary bg-gradient-to-tr to-purple-400 text-white shadow-lg">
						View Detail
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
