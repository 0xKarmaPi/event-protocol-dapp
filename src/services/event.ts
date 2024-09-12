import AXIOS from "@/configs/axios";
import { IEvent, IGetEventsRequest, IPagination } from "@/types/event";

export const getEvents = async (
	query: IGetEventsRequest,
): Promise<IPagination<IEvent>> => {
	const res = await AXIOS.get(`/events`, {
		params: query,
	});
	return res.data;
};

export const getEvent = async (
	id: string,
	network: "solana" | "sonic",
): Promise<IEvent> => {
	const res = await AXIOS.get(`/events/${network}/${id}`);
	return res.data;
};
