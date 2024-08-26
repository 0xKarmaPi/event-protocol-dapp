import AXIOS from "@/configs/axios";
import { IAuthRequest, IAuthResponse } from "@/types/auth";

export const generatePayload = async (address: string): Promise<string> => {
	// const res = await AXIOS.get(`/auth/generate-payload`, {
	// 	params: {
	// 		address,
	// 	},
	// });
	// return res.data;
	return `Sign in to Eventprotocol: ${new Date().getTime()}`;
};

export const signIn = async (body: IAuthRequest): Promise<IAuthResponse> => {
	const res = await AXIOS.post(`/sign-in`, body);
	return res.data;
};
