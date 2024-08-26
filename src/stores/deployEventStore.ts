/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
import { create } from "zustand";
import { web3 } from "@coral-xyz/anchor";

type DeployEventState = {
	description?: string;
	startDate?: string;
	endDate?: string;
	leftDescription: string;
	rightDescription: string;
	leftMint: web3.PublicKey | null;
	rightMint: web3.PublicKey | null;
};

type ActionDeployEvent = {
	updateDescription: (description: string) => void;
	updateStartDate: (startDate: string) => void;
	updateEndDate: (endDate: string) => void;
	updateLeftDescription: (description: string) => void;
	updateRightDescription: (description: string) => void;
	updateLeftMint: (mint: web3.PublicKey | null) => void;
	updateRightMint: (mint: web3.PublicKey | null) => void;
};
const initDeployEventState: DeployEventState = {
	description: "",
	startDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
	endDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
	leftMint: null,
	rightMint: null,
	leftDescription: "YES",
	rightDescription: "NO",
};
export const useDeployEventStore = create<DeployEventState & ActionDeployEvent>(
	(set) => ({
		...initDeployEventState,
		updateDescription: (description) => set(() => ({ description })),
		updateStartDate: (startDate) => set(() => ({ startDate })),
		updateEndDate: (endDate) => set(() => ({ endDate })),
		updateLeftDescription: (description) =>
			set(() => ({ leftDescription: description })),
		updateRightDescription: (description) =>
			set(() => ({ rightDescription: description })),
		updateLeftMint: (mint) => set(() => ({ leftMint: mint })),
		updateRightMint: (mint) => set(() => ({ rightMint: mint })),
	}),
);
