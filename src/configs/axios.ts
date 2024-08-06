import { COOKIES } from "@/utils/constants";
import axios from "axios";
import { getCookie } from "cookies-next";

const accessToken = getCookie(COOKIES.ACCESSTOKEN);

const AXIOS = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "69420",
	},
	timeout: 60000,
});

AXIOS.interceptors.request.use((config) => {
	if (config.headers) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

AXIOS.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		return Promise.reject(error);
	},
);

export default AXIOS;
