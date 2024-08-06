import { IUser } from "./user";

export interface IAuthRequest {
	address: string;
	proof: string;
	signature: string;
}

export interface IAuthResponse {
	accessToken: string;
	user: IUser;
}
