import AXIOS from "@/configs/axios";
import {
	ICreateEventRequest,
	IEvent,
	IGetEventsRequest,
	IPagination,
} from "@/types/event";

export const deployEvent = async (body: ICreateEventRequest) => {
	const res = await AXIOS.post(`/events`, body);
	return res.data;
};

export const getEvents = async (
	query: IGetEventsRequest,
): Promise<IPagination<IEvent>> => {
	const res = await AXIOS.get(`/events`, {
		params: query,
	});
	return res.data;
};

export const getEvent = async (id: string): Promise<IEvent> => {
	const res = await AXIOS.get(`/events/${id}`);
	return res.data;
};
