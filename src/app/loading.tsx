import { Spinner } from "@nextui-org/react";

export default function Loading() {
	return (
		<section className="flex h-[50vh] w-full items-center justify-center">
			<Spinner label="Loading..." color="warning" />
		</section>
	);
}
