import { IEvent } from "@/types/event";
import { IUser } from "@/types/user";
import dayjs from "dayjs";
import { create } from "zustand";

interface UserState {
	user: IUser | null;
}

interface ActionUser {
	updateUser: (user: IUser) => void;
}

export const useUserStore = create<UserState & ActionUser>((set) => ({
	user: null,
	updateUser: (user) => set(() => ({ user })),
}));

interface ActionDeployEvent {
	updateDeployEvent: (event: IEvent) => void;
}

interface DeployEventState {
	event: IEvent;
}
export const useDeployEventStore = create<DeployEventState & ActionDeployEvent>(
	(set) => ({
		event: {
			description: "",
			endTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
			options: [
				{
					token: "SOL",
					description: "",
					isCorrect: false,
				},
				{
					token: "SOL",
					description: "",
					isCorrect: false,
				},
			],
		},
		updateDeployEvent: (event) => set(() => ({ event: { ...event } })),
	}),
);
