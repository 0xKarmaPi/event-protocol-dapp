import AXIOS from "@/configs/axios";
import { IStatisticsInfo } from "@/types/user";

export const getStatistics = async (): Promise<IStatisticsInfo> => {
	const res = await AXIOS.get(`/statistics`);
	return res.data;
};
