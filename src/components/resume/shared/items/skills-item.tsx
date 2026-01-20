import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageIcon } from "../page-icon";
import { PageLevel } from "../page-level";

type SkillsItemProps = SectionItem<"skills"> & {
	className?: string;
};

export function SkillsItem({ className, ...item }: SkillsItemProps) {
	return (
		<div className={cn("skills-item", className)}>
			<div className="section-item-header flex items-center gap-x-1.5">
				<PageIcon icon={item.icon} className="section-item-icon skills-item-icon shrink-0" />
				<p className="section-item-name skills-item-name">
					<strong>{item.name}</strong>
				</p>
			</div>

			<div>
				<p className="section-item-proficiency skills-item-proficiency opacity-80">{item.proficiency}</p>
				<small className="section-item-keywords skills-item-keywords">{item.keywords.join(", ")}</small>
			</div>

			<PageLevel level={item.level} className="section-item-level skills-item-level" />
		</div>
	);
}
