import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";

type ReferencesItemProps = SectionItem<"references"> & {
	className?: string;
};

export function ReferencesItem({ className, ...item }: ReferencesItemProps) {
	return (
		<div className={cn("references-item", className)}>
			<p className="section-item-name references-item-name">
				<strong>{item.name}</strong>
			</p>
			<div className="section-item-description references-item-description">
				<TiptapContent content={item.description} />
			</div>
		</div>
	);
}
