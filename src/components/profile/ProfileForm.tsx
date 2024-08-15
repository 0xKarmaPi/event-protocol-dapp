"use client";

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Textarea,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import phantom from "/public/assets/phantom-icon.png";
import { ChangeEvent, useEffect, useState } from "react";
import { FiArrowUpRight, FiEdit } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";

interface UserProfile {
	username: string;
	address: string;
	bio?: string;
	avatar?: string;
}

export default function ProfileForm() {
	const session = useSession();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UserProfile>();

	const [isEdit, setEdit] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedFile) {
			setPreviewUrl(null);
			return;
		}

		const objectUrl = URL.createObjectURL(selectedFile);
		setPreviewUrl(objectUrl);

		// Cleanup
		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedFile]);

	useEffect(() => {
		setValue("username", session.data?.user?.name ?? "");
	}, [session.data?.user, setValue]);

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast("Please select an image file", { type: "error" });
				return;
			}
			setSelectedFile(file);
		}
	};

	const onSubmit: SubmitHandler<UserProfile> = (data) => {
		console.log({
			...data,
			avatar: previewUrl,
		});
		toast("Updated successfully", { type: "success" });
		setEdit(false);
	};

	if (!session.data?.user) {
		return <p className="text-white">Please connect your wallet.</p>;
	}
	return (
		<Card className="max-w-3xl md:min-w-[600px]">
			<CardHeader>
				<div className="w-full text-left text-2xl font-semibold">
					My Profile
				</div>
			</CardHeader>
			<CardBody>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex items-start justify-center gap-4"
				>
					<div className="relative">
						{isEdit && (
							<Button
								onClick={() =>
									document.getElementById("file")?.click()
								}
								size="sm"
								isIconOnly
								className="absolute right-1 top-1"
								startContent={<FiEdit />}
							/>
						)}
						<input
							id="file"
							hidden
							type="file"
							accept=".jpg,.jpeg,.png"
							onChange={handleFileInputChange}
						/>
						<Image
							className="h-[150px] w-[150px] rounded-lg object-cover"
							src={
								previewUrl ||
								"https://i.seadn.io/gcs/files/8f942239cb83160763d63846ab800575.png?auto=format&dpr=1&h=500"
							}
							alt=""
							width={150}
							height={150}
						/>
					</div>

					<div className="flex flex-1 flex-col gap-4 text-left">
						<Input
							isInvalid={errors?.username ? true : false}
							errorMessage={errors.username?.message}
							{...register("username", {
								required: {
									value: true,
									message: "Username is required",
								},
							})}
							variant="faded"
							readOnly={!isEdit}
							label="Username"
							startContent="@"
						/>
						<Input
							variant="faded"
							isReadOnly
							startContent={
								<Image
									src={phantom}
									alt="phantom"
									width={16}
									className="mb-1"
								/>
							}
							label="Wallet address"
							value={session.data.user.email || ""}
							description={
								<Link
									target="_blank"
									className="flex gap-1 text-right"
									href={`https://solscan.io/account/${session.data.user.email}`}
								>
									View on Solscan <FiArrowUpRight size={16} />
								</Link>
							}
						/>
						<Textarea
							{...register("bio")}
							maxRows={5}
							variant="faded"
							label="Bio"
							readOnly={!isEdit}
							placeholder="Enter your bio..."
						/>
						<div className="flex justify-end gap-2">
							{isEdit ? (
								<>
									<Button
										color="danger"
										variant="light"
										onPress={() => setEdit(false)}
										className="text-danger"
									>
										Cancel
									</Button>
									<Button color="success" type="submit">
										Save
									</Button>
								</>
							) : (
								<Button
									onPress={() => setEdit(true)}
									className="bg-gradient-to-tr from-primary to-purple-400"
								>
									Edit
								</Button>
							)}
						</div>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
