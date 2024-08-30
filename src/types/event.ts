import { web3 } from "@coral-xyz/anchor";

export interface IEvent {
	id: string;
	description: string;
	burning?: boolean;
	result?: "Left" | "Right";
	left_description: string;
	left_mint: string;
	right_description: string;
	right_mint: string;
	pubkey: string;
	creator: string;
	end_date: string;
	start_date: string;
	tickets?: Array<EventTicket>;
	left_mint_decimals?: number;
	right_mint_decimals?: number;
}

export interface EventTicket {
	amount: string;
	claimed: boolean;
	created_date: string;
	creator: string;
	event_pubkey: string;
	pubkey: string;
	result: "Lost" | "Pending" | "Won";
	selection: "Left" | "Right";
	withdrawn: boolean;
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
	predictor?: string;
}

export interface IPagination<T> {
	nodes: T[];
	page: number;
	total: number;
}
