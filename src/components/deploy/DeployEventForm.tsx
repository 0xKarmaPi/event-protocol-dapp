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
import { useDeployEventStore } from "@/configs/zustand";
import { useEffect } from "react";
import { parseDate, parseDateTime } from "@internationalized/date";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { deployEvent } from "@/services/event";

type EventInputs = {
	description: string;
	endTime: DateValue;
};
const LIMIT_DESCRIPTION = 144;

export default function DeployEventForm() {
	const session = useSession();
	const { event, updateDeployEvent } = useDeployEventStore();

	const mutateDeployEvent = useMutation({
		mutationKey: ["deployEvent"],
		mutationFn: deployEvent,
		onError: () => {},
		onSuccess: (data) => {},
	});

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm<EventInputs>();

	useEffect(() => {
		if (event) {
			setValue("description", event?.description);
			setValue("endTime", parseDateTime(event?.endTime));
		}
	}, [event, setValue]);

	const onSubmit: SubmitHandler<EventInputs> = (data) => {
		if (!session.data?.user) {
			toast("Please connect your wallet", { type: "error" });
			return;
		}
		mutateDeployEvent.mutate({
			description: data.description,
			endTime: dayjs(data.endTime.toString()).format(
				"YYYY-MM-DDTHH:mm:ss.SSS[Z]",
			),
			options: event?.options,
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
							name="endTime"
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
									errorMessage={errors?.endTime?.message}
									isInvalid={!!errors?.endTime}
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
							isLoading={mutateDeployEvent.isPending}
						>
							Pay SOL submit
						</Button>
					</div>
				</CardFooter>
			</Card>
		</form>
	);
}
