import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type EducationItemProps = SectionItem<"education"> & {
	className?: string;
};

export function EducationItem({ className, ...item }: EducationItemProps) {
	return (
		<div className={cn("education-item", className)}>
			<div className="section-item-header education-item-header mb-2">
				<div className="flex items-center justify-between">
					<p className="section-item-title education-item-title">
						<strong>{item.school}</strong>
					</p>
					<p className="section-item-metadata education-item-metadata text-right">
						{[item.degree, item.grade].filter(Boolean).join(" • ")}
					</p>
				</div>
				<div className="flex items-center justify-between">
					<p>{item.area}</p>
					<p className="section-item-metadata education-item-metadata text-right">
						{[item.location, item.period].filter(Boolean).join(" • ")}
					</p>
				</div>
			</div>
			<div className="section-item-description education-item-description">
				<TiptapContent content={item.description} />
			</div>
			<div className="section-item-link education-item-link">
				<PageLink {...item.website} label={item.website.label} />
			</div>
		</div>
	);
}
