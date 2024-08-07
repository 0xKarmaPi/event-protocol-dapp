"use client";

import {
	Card,
	CardHeader,
	CardBody,
	Textarea,
	DatePicker,
	CardFooter,
	Button,
	DateValue,
} from "@nextui-org/react";
import OptionSetup from "./OptionSetup";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import dayjs from "dayjs";

type EventInputs = {
	description: string;
	endDate: DateValue;
};
const LIMIT_DESCRIPTION = 144;

export default function DeployEventForm() {
	const {
		register,
		handleSubmit,
		getValues,
		control,
		formState: { errors },
	} = useForm<EventInputs>();

	const onSubmit: SubmitHandler<EventInputs> = (data) => {
		console.log({
			...data,
			endDate: dayjs(getValues("endDate").toString()).format(),
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex items-center justify-center"
		>
			<Card className="w-[90%] md:min-w-[600px]">
				<CardHeader>
					<div className="w-full text-center text-2xl font-semibold">
						Deploy Prediction Event
					</div>
				</CardHeader>
				<CardBody className="flex flex-col items-start gap-3">
					<p className="text-left font-bold">
						Please enter a description of the prediction question
						topic
					</p>
					<Textarea
						description={`Maximum ${LIMIT_DESCRIPTION} characters`}
						type="text"
						label="Description"
						isInvalid={errors?.description ? true : false}
						{...register("description", {
							required: {
								value: true,
								message: "Description of topic is required",
							},
							maxLength: {
								value: LIMIT_DESCRIPTION,
								message: `Maximum ${LIMIT_DESCRIPTION} characters`,
							},
						})}
						errorMessage={errors?.description?.message}
					/>
					<p className="mt-6 text-left font-bold">
						Options Description
					</p>
					<div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
						<OptionSetup optionName="Option A" />
						<OptionSetup optionName="Option B" />
					</div>
					<div className="mt-6 text-left font-bold">Time setup</div>
					<div className="z-50 flex w-full items-start gap-2">
						<Controller
							control={control}
							name="endDate"
							rules={{
								required: {
									value: true,
									message: "End date is required",
								},
							}}
							render={({ field }) => (
								<DatePicker
									granularity="minute"
									hourCycle={12}
									value={field.value}
									onChange={(date) => {
										field.onChange(date);
									}}
									errorMessage={errors?.endDate?.message}
									isInvalid={!!errors?.endDate}
									label="Select End Date"
								/>
							)}
						/>
					</div>
				</CardBody>
				<CardFooter className="flex flex-col gap-2">
					<p className="mx-4 mb-4 text-left text-xs italic text-yellow-500">
						* As the creator of this event, you will receive a 2.5%
						fee from the total tokens involved in the prediction
						event.
					</p>
					<div className="flex w-full flex-row gap-2">
						<Button
							className="bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg"
							fullWidth
							type="submit"
						>
							Pay SOL submit
						</Button>
					</div>
				</CardFooter>
			</Card>
		</form>
	);
}
