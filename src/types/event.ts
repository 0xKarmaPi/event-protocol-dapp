export interface IEvent {
	id?: string;
	userId?: string;
	description: string;
	createdAt?: string;
	author?: {
		username: string;
		address: string;
	};
	address?: string;
	endTime: string;
	options: IEventOption[];
	result?: "WIN" | "LOSE";
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
}

export interface IPagination<T> {
	list: T[];
	maxPage: number;
	total: number;
}
