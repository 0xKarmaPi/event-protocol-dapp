export interface IUser {
	id: number;
	username: string;
	address: string;
}

export interface IStatisticsInfo {
	total_created: number;
	total_lose: number;
	total_participated: number;
	total_win: number;
}
