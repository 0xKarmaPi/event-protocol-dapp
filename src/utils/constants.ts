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
		name: "IVO",
		path: process.env.NEXT_PUBLIC_IVO_APP_URL,
		target: "_blank",
	},
];
