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
								dayjs(event.endTime).isBefore(Date.now())
									? "text-red-500"
									: "text-green-500",
							)}
						>
							{dayjs(event.endTime).isBefore(Date.now())
								? "Ended"
								: "End Time"}
							<br />
							{dayjs(event.endTime).isAfter(Date.now()) &&
								dayjs(event.endTime).format(
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
						<div className="text-center text-sm font-semibold">
							Option A:
							<br />
							<span className="text-lg">
								{event.options[0].description}
							</span>
						</div>
						<div className="text-sm opacity-60">
							Acceptable Vote Tick:{` `}
							{event.options[0].token}
						</div>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="text-center text-sm font-semibold">
							Option B: <br />
							<span className="text-lg">
								{event.options[1].description}
							</span>
						</div>
						<div className="text-sm opacity-60">
							Acceptable Vote Tick:{` `}
							{event.options[1].token}
						</div>
					</div>
				</div>
				<Link href={`/prediction-events/${event.id}`}>
					<Button className="bg-gradient-to-tr from-primary to-purple-400 text-white shadow-lg">
						View Detail
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
