import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type AwardsItemProps = SectionItem<"awards"> & {
	className?: string;
};

export function AwardsItem({ className, ...item }: AwardsItemProps) {
	return (
		<div className={cn("awards-item", className)}>
			<div className="section-item-header awards-item-header">
				<div className="flex items-center justify-between">
					<p className="section-item-title awards-item-title">
						<strong>{item.title}</strong>
					</p>
					<p className="section-item-metadata text-right">{item.date}</p>
				</div>
				<div className="flex items-center justify-between">
					<p className="section-item-awarder awards-item-awarder">{item.awarder}</p>
				</div>
			</div>
			<div className="section-item-description awards-item-description">
				<TiptapContent content={item.description} />
			</div>
			<div className="section-item-link awards-item-link">
				<PageLink {...item.website} label={item.website.label} />
			</div>
		</div>
	);
}
