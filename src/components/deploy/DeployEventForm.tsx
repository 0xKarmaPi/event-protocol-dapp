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
	Checkbox,
} from "@nextui-org/react";
import OptionSetup from "./OptionSetup";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { parseDateTime } from "@internationalized/date";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useDeployEventStore } from "@/stores/deployEventStore";
import { createPredictionEvent } from "@/services/deploy-prediction-event";
import { useAnchor } from "@/hooks/useAnchor";
import dayjs from "dayjs";
import { BN } from "bn.js";
import { useWallet } from "@solana/wallet-adapter-react";

type EventInputs = {
	description: string;
	endDate: DateValue;
	startDate: DateValue;
	burning: boolean;
};
const LIMIT_DESCRIPTION = 144;

export default function DeployEventForm() {
	const { program } = useAnchor();
	const { publicKey: userPublicKey } = useWallet();
	// const session = useSession();

	const {
		description,
		endDate,
		startDate,
		leftMint,
		rightDescription,
		leftDescription,
		rightMint,
	} = useDeployEventStore();

	const mutateDeployEvent = useMutation({
		mutationKey: ["deployEvent"],
		mutationFn: createPredictionEvent,
		onError: (error) => {
			console.log(error);
			toast("Deploy event failed", { type: "error" });
		},
		onSuccess: () => {
			reset();
			toast("Deploy event successfully", { type: "success" });
		},
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
		reset,
	} = useForm<EventInputs>({
		defaultValues: {
			description: description!,
			endDate: parseDateTime(endDate!),
			startDate: parseDateTime(startDate!),
		},
	});

	const onSubmit: SubmitHandler<EventInputs> = (data) => {
		if (!userPublicKey) {
			toast("Please connect your wallet", { type: "error" });
			return;
		}
		if (userPublicKey) {
			mutateDeployEvent.mutate({
				options: {
					description: data.description,
					endDate: new BN(dayjs(data.endDate.toString()).unix()),
					startDate: new BN(dayjs(data.startDate.toString()).unix()),
					leftDescription,
					rightDescription,
					leftMint,
					rightMint,
					burning: data.burning,
				},
				program,
				userPublicKey,
			});
		}
	};
	const startDateValue = watch("startDate");

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
						<OptionSetup optionName="Option A" isLeft={true} />
						<OptionSetup optionName="Option B" isLeft={false} />
					</div>
					<div className="mt-6 text-left font-bold">Time setup</div>
					<div className="z-50 flex w-full flex-col items-start gap-3 md:flex-row">
						<Controller
							control={control}
							name="startDate"
							rules={{
								required: {
									value: true,
									message: "Start date is required",
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
									errorMessage={errors?.startDate?.message}
									isInvalid={!!errors?.startDate}
									label="Select Start Date"
								/>
							)}
						/>
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
									minValue={startDateValue}
								/>
							)}
						/>
					</div>
					<Checkbox {...register("burning")}>
						Burns losing side tokens <br />
					</Checkbox>
					{watch("burning") && (
						<p className="mx-4 text-left text-xs italic text-danger">
							* All tokens will be burned if player predict wrong
						</p>
					)}

					<p className="mx-4 text-left text-xs italic text-yellow-500">
						* As the creator of this event, you will receive a 2.5%
						fee from the total tokens involved in the prediction
						event.
					</p>
				</CardBody>
				<CardFooter className="flex flex-col gap-2">
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
