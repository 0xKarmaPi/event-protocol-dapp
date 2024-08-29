export const COOKIES = {
	ACCESSTOKEN: "accessToken",
	REFRESHTOKEN: "refreshToken",
};

export const NAV_BARS = [
	{
		name: "Dashboard",
		path: "/dashboard",
	},
	{
		name: "Deploy",
		path: "/deploy",
	},
	{
		name: "Prediction Events",
		path: "/prediction-events",
	},
	{
		name: "Pumpfun",
		path: "https://pump.fun/board",
		target: "_blank",
	},
	{
		name: "IVO",
		path: process.env.NEXT_PUBLIC_IVO_APP_URL,
		target: "_blank",
	},
];

// Constants for Smart Contract

export const SIDE = {
	Left: {
		left: {},
	},
	Right: {
		right: {},
	},
};

export type SIDE = (typeof SIDE)[keyof typeof SIDE];

export const MASTER_SEEDS = Buffer.from("master");

export const PREDICTION_EVENT_SEEDS_PREFIX = Buffer.from("prediction_event");

export const TOKENS_RIGHT_POOL_SEEDS_PREFIX = Buffer.from("right_pool");

export const TOKENS_LEFT_POOL_SEEDS_PREFIX = Buffer.from("left_pool");

export const TICKET_SEEDS_PREFIX = Buffer.from("ticket");

export const TOKENS_SYSTEM_FEE_SEEDS_PREFIX = Buffer.from("system_fee");

export const PAGE_SIZE_DEFAULT = 10;

export const EVENT_TOKEN_DECIMAL = 1000000;
