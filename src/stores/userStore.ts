import { IUser } from "@/types/user";
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
