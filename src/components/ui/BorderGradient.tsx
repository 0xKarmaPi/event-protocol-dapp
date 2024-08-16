import clsx from "clsx";

export default function BorderGradient({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={clsx(
				"h-fit bg-gradient-to-tr from-primary to-purple-400",
				className,
			)}
		>
			{children}
		</div>
	);
}
