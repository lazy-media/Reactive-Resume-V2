import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageIcon } from "../page-icon";

type InterestsItemProps = SectionItem<"interests"> & {
	className?: string;
};

export function InterestsItem({ className, ...item }: InterestsItemProps) {
	return (
		<div className={cn("interests-item", className)}>
			<div className="section-item-header flex items-center gap-x-1.5">
				<PageIcon icon={item.icon} className="section-item-icon interests-item-icon shrink-0" />
				<p className="section-item-name interests-item-name">
					<strong>{item.name}</strong>
				</p>
			</div>

			<p className="section-item-keywords interests-item-keywords opacity-80">{item.keywords.join(", ")}</p>
		</div>
	);
}
