import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageIcon } from "../page-icon";
import { PageLink } from "../page-link";

type ProfilesItemProps = SectionItem<"profiles"> & {
	className?: string;
};

export function ProfilesItem({ className, ...item }: ProfilesItemProps) {
	return (
		<div className={cn("profiles-item", className)}>
			<div className="section-item-header flex items-center gap-x-1.5">
				<PageIcon icon={item.icon} className="section-item-icon profiles-item-icon shrink-0" />
				<p className="section-item-network profiles-item-network">
					<strong>{item.network}</strong>
				</p>
			</div>

			<PageLink
				{...item.website}
				label={item.website.label || item.username}
				className="section-item-link profiles-item-link"
			/>
		</div>
	);
}
