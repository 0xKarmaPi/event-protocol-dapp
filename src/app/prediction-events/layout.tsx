export default function PredictionEventsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="mx-auto flex w-4/5 flex-col items-center justify-center gap-4 py-8 md:py-10">
			{children}
		</section>
	);
}
