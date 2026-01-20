import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type ProjectsItemProps = SectionItem<"projects"> & {
	className?: string;
};

export function ProjectsItem({ className, ...item }: ProjectsItemProps) {
	return (
		<div className={cn("projects-item", className)}>
			<div className="section-item-header projects-item-header">
				<div className="flex items-center justify-between">
					<p className="section-item-title projects-item-title">
						<strong>{item.name}</strong>
					</p>
					<p className="section-item-metadata text-right">{item.period}</p>
				</div>
			</div>
			<div className="section-item-description projects-item-description">
				<TiptapContent content={item.description} />
			</div>
			<div className="section-item-link projects-item-link">
				<PageLink {...item.website} label={item.website.label} />
			</div>
		</div>
	);
}
