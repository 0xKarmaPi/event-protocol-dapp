import AXIOS from "@/configs/axios";
import {
	ICreateEventRequest,
	IEvent,
	IGetEventsRequest,
	IPagination,
} from "@/types/event";

export const deployEvent = async (body: ICreateEventRequest) => {
	const res = await AXIOS.post(`/prediction-events`, body);
	return res.data;
};

export const getEvents = async (
	query: IGetEventsRequest,
): Promise<IPagination<IEvent>> => {
	const res = await AXIOS.get(`/prediction-events`, {
		params: query,
	});
	return res.data;
};

export const getEvent = async (id: string): Promise<IEvent> => {
	const res = await AXIOS.get(`/prediction-events/${id}`);
	return res.data;
};
