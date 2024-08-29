import { web3 } from "@coral-xyz/anchor";

export interface IEvent {
	id?: string;
	userId?: string;
	description: string;
	createdAt?: string;
	address?: string;
	endDate?: string;
	startDate?: string;
	leftMint: web3.PublicKey | null;
	rightMint: web3.PublicKey | null;
	burning?: boolean;
	result?: "Left" | "Right";
	left_description: string;
	left_mint: string;
	right_description: string;
	right_mint: string;
	pubkey: string;
	creator: string;
	deleted: boolean;
	end_date: string;
	start_date: string;
	left_amount?: number;
	right_amount?: number;
}

export interface IEventOption {
	id?: string;
	name?: string;
	description: string;
	token: string;
	address?: string;
	amount?: number;
	isCorrect?: boolean;
	selected?: boolean;
}

export interface ICreateEventRequest {
	description: string;
	endTime: string;
	options: IOptionCreateEvent[];
}

export interface IOptionCreateEvent {
	description: string;
	token: string;
	address?: string;
	isCorrect?: boolean;
}

export interface IGetEventsRequest {
	page: number;
	limit: number;
	creator?: string;
}

export interface IPagination<T> {
	nodes: T[];
	page: number;
	total: number;
}
