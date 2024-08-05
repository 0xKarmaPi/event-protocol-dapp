import EventDetailForm from "@/components/prediction-events/EventDetailForm";

export default function Home() {
	return (
		<section className="mx-auto flex w-[90%] flex-col items-center justify-center gap-4 py-8 md:py-10">
			<EventDetailForm />
		</section>
	);
}
