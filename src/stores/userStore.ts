import { IUser } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
	user: IUser | null;
	network: "solana" | "sonic";
}

interface ActionUser {
	updateUser: (user: IUser) => void;
	updateNetwork: (network: "solana" | "sonic") => void;
}

export const useUserStore = create<
	UserState & ActionUser,
	[["zustand/persist", UserState]]
>(
	persist(
		(set) => ({
			user: null,
			network: "solana",
			updateUser: (user) => set(() => ({ user })),
			updateNetwork: (network) => set(() => ({ network })),
		}),
		{
			name: "user-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
