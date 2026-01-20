import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type VolunteerItemProps = SectionItem<"volunteer"> & {
	className?: string;
};

export function VolunteerItem({ className, ...item }: VolunteerItemProps) {
	return (
		<div className={cn("volunteer-item", className)}>
			<div className="section-item-header volunteer-item-header">
				<div className="flex items-center justify-between">
					<p className="section-item-title volunteer-item-title">
						<strong>{item.organization}</strong>
					</p>
					<p className="section-item-metadata text-right">{item.period}</p>
				</div>
				<div className="flex items-center justify-between">
					<p className="section-item-location volunteer-item-location">{item.location}</p>
				</div>
			</div>
			<div className="section-item-description volunteer-item-description">
				<TiptapContent content={item.description} />
			</div>
			<div className="section-item-link volunteer-item-link">
				<PageLink {...item.website} label={item.website.label} />
			</div>
		</div>
	);
}
