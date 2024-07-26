export interface IEvent {
	id: string;
	address: string;
	name: string;
	description: string;
	start: string;
	end: string;
	options: IEventOption[];
}

export interface IEventOption {
	id: string;
	name: string;
	description: string;
	token: string;
	address: string;
	amount: number;
}
