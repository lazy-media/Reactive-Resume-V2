import { TiptapContent } from "@/components/input/rich-input";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type CertificationsItemProps = SectionItem<"certifications"> & {
	className?: string;
};

export function CertificationsItem({ className, ...item }: CertificationsItemProps) {
	return (
		<div className={cn("certifications-item", className)}>
			<div className="section-item-header certifications-item-header">
				<div className="flex items-center justify-between">
					<p className="section-item-title certifications-item-title">
						<strong>{item.title}</strong>
					</p>
					<p className="section-item-metadata text-right">{item.date}</p>
				</div>
				<div className="flex items-center justify-between">
					<p className="section-item-issuer certifications-item-issuer">{item.issuer}</p>
				</div>
			</div>
			<div className="section-item-description certifications-item-description">
				<TiptapContent content={item.description} />
			</div>
			<div className="section-item-link certifications-item-link">
				<PageLink {...item.website} label={item.website.label} />
			</div>
		</div>
	);
}
