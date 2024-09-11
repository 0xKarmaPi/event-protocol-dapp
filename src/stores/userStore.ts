import { IUser } from "@/types/user";
import { create } from "zustand";

interface UserState {
	user: IUser | null;
	network: "solana" | "sonic";
}

interface ActionUser {
	updateUser: (user: IUser) => void;
	updateNetwork: (network: "solana" | "sonic") => void;
}

export const useUserStore = create<UserState & ActionUser>((set) => ({
	user: null,
	network: "solana",
	updateUser: (user) => set(() => ({ user })),
	updateNetwork: (network) => set(() => ({ network })),
}));
