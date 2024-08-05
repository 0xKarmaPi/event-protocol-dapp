import EventDetailForm from "@/components/prediction-events/EventDetailForm";

export default function EventDetail({ params }: { params: { id: string } }) {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-4 md:py-10">
			<EventDetailForm />
		</div>
	);
}
