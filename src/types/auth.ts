import { IUser } from "./user";

export interface IAuthRequest {
	address: string;
	message: string;
	signed_message: string;
}

export interface IAuthResponse {
	access_token: string;
	// user: IUser;
}
