import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type PublicationsItemProps = SectionItem<"publications"> & {
	className?: string;
};

export function PublicationsItem({ className, ...item }: PublicationsItemProps) {
	return (
		<div className={cn("publications-item", className)}>
			<div className="section-item-header publications-item-header">
				<div className="flex items-center justify-between">
					<p className="section-item-title publications-item-title">
						<strong>{item.title}</strong>
					</p>
					<p className="section-item-metadata text-right">{item.date}</p>
				</div>
				<div className="flex items-center justify-between">
					<p className="section-item-publisher publications-item-publisher">{item.publisher}</p>
				</div>
			</div>
			<div className="section-item-description publications-item-description">
				<TiptapContent content={item.description} />
			</div>
			<div className="section-item-link publications-item-link">
				<PageLink {...item.website} label={item.website.label} />
			</div>
		</div>
	);
}
