import { TiptapContent } from "@/components/input/rich-input";
import { cn } from "@/utils/style";
import { useResumeStore } from "../store/resume";

type PageCustomSectionProps = {
	sectionId: string;
	className?: string;
};

export function PageCustomSection({ sectionId, className }: PageCustomSectionProps) {
	const section = useResumeStore((state) =>
		state.resume.data.customSections.find((section) => section.id === sectionId),
	);

	// biome-ignore lint/complexity/noUselessFragments: render empty fragment, instead of null
	if (!section) return <></>;

	return (
		<section
			className={cn(
				`page-section page-section-custom page-section-${sectionId} wrap-break-word`,
				section.hidden && "hidden",
				section.content === "" && "hidden",
				className,
			)}
		>
			<h6 className="mb-2 text-(--page-primary-color)">{section.title}</h6>

			<div className="section-content">
				<TiptapContent style={{ columnCount: section.columns }} content={section.content} />
			</div>
		</section>
	);
}
