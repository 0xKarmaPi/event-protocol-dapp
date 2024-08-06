import AXIOS from "@/configs/axios";
import { IAuthRequest, IAuthResponse } from "@/types/auth";

export const generatePayload = async (address: string): Promise<string> => {
	const res = await AXIOS.get(`/auth/generate-payload`, {
		params: {
			address,
		},
	});
	return res.data;
};

export const signIn = async (body: IAuthRequest): Promise<IAuthResponse> => {
	const res = await AXIOS.post(`/auth/sign-in`, body);
	return res.data;
};
