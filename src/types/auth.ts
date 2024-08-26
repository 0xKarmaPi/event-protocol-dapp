import { IUser } from "./user";

export interface IAuthRequest {
	address: string;
	message: string;
	signed_message: string;
}

export interface IAuthResponse {
	accessToken: string;
	user: IUser;
}
