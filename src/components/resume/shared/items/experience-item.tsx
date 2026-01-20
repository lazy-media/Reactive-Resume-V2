import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type ExperienceItemProps = SectionItem<"experience"> & {
	className?: string;
};

export function ExperienceItem({ className, ...item }: ExperienceItemProps) {
	return (
		<div className={cn("experience-item", className)}>
			<div className="section-item-header experience-item-header">
				<div className="flex items-center justify-between">
					<p className="section-item-title experience-item-title">
						<strong>{item.company}</strong>
					</p>
					<p className="section-item-metadata experience-item-metadata text-right">{item.location}</p>
				</div>
				<div className="flex items-center justify-between">
					<p>{item.position}</p>
					<p className="section-item-metadata experience-item-metadata text-right">{item.period}</p>
				</div>
			</div>
			<div className="section-item-description experience-item-description">
				<TiptapContent content={item.description} />
			</div>
			<div className="section-item-link experience-item-link">
				<PageLink {...item.website} label={item.website.label} />
			</div>
		</div>
	);
}
