"use client";

import OptionSetup from "@/components/deploy/OptionSetup";
import {
	Card,
	CardHeader,
	CardBody,
	Textarea,
	CardFooter,
	Button,
	DatePicker,
	TimeInput,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { useState } from "react";

export default function DeployPage() {
	const [description, setDescription] = useState("");
	const [endTime, setEndTime] = useState(
		dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss"),
	);
	return (
		<div>
			<div className="flex justify-center pt-6 md:pt-0">
				<Card className="w-[90%] md:min-w-[600px]">
					<CardHeader>
						<div className="w-full text-center text-2xl font-semibold">
							Deploy Prediction Event
						</div>
					</CardHeader>
					<CardBody className="flex flex-col items-start gap-3">
						<p className="text-left font-bold">
							Please enter a description of the prediction
							question topic
						</p>
						<Textarea
							type="text"
							label="Description"
							value={description}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						/>
						<p className="mt-6 text-left font-bold">
							Options Description
						</p>
						<div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
							<OptionSetup optionName="Option A" />
							<OptionSetup optionName="Option B" />
						</div>
						<div className="mt-6 text-left font-bold">
							Time setup
						</div>
						<div className="z-50 flex w-full items-center gap-2">
							<DatePicker
								className="flex-[2]"
								label="Select Date"
							/>
							<TimeInput className="flex-1" label="Select Time" />
						</div>
					</CardBody>
					<CardFooter className="flex flex-col gap-2">
						<p className="mx-4 mb-4 text-left text-xs italic text-yellow-500">
							* As the creator of this event, you will receive a
							2.5% fee from the total tokens involved in the
							prediction event.
						</p>
						<div className="flex w-full flex-row gap-2">
							<Button
								className="bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg"
								fullWidth
							>
								Pay SOL submit
							</Button>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
