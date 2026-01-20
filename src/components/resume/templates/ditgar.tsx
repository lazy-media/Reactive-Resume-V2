import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Section Heading
	"[&>h6]:border-(--page-primary-color) [&>h6]:border-b",

	// Icon Colors in Sidebar Layout
	"group-data-[layout=sidebar]:[&_.section-item_i]:text-(--page-background-color)!",

	// Section Item Header in Sidebar Layout
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
);

/**
 * Template: Ditgar
 */
export function DitgarTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-ditgar page-content grid min-h-[inherit] grid-cols-3">
			<div className={cn("sidebar group flex flex-col", !(isFirstPage || !fullWidth) && "hidden")}>
				{isFirstPage && <Header />}

				<div className="flex-1 space-y-4 bg-(--page-primary-color)/20 px-(--page-margin-x) py-(--page-margin-y)">
					{sidebar.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</div>
			</div>

			<div className={cn("main group", !fullWidth ? "col-span-2" : "col-span-3")}>
				{isFirstPage &&
					(() => {
						const SummaryComponent = getSectionComponent("summary", { sectionClassName });
						return <SummaryComponent id="summary" />;
					})()}

				<div className="space-y-4 px-(--page-margin-x) py-(--page-margin-y)">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</div>
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);

	return (
		<div className="page-header space-y-4 bg-(--page-primary-color) px-(--page-margin-x) py-(--page-margin-y) text-(--page-background-color)">
			<PagePicture />

			<div>
				<h2 className="font-bold text-2xl">{basics.name}</h2>
				<p>{basics.headline}</p>
			</div>

			<div className="flex flex-col items-start gap-y-2 text-sm">
				{basics.location && (
					<div className="flex items-center gap-x-1.5">
						<PageIcon icon="map-pin" className="ph-bold" />
						<div>{basics.location}</div>
					</div>
				)}
				{basics.phone && (
					<div className="flex items-center gap-x-1.5">
						<PageIcon icon="phone" className="ph-bold" />
						<PageLink url={`tel:${basics.phone}`} label={basics.phone} />
					</div>
				)}
				{basics.email && (
					<div className="flex items-center gap-x-1.5">
						<PageIcon icon="at" className="ph-bold" />
						<PageLink url={`mailto:${basics.email}`} label={basics.email} />
					</div>
				)}
				{basics.website.url && (
					<div className="flex items-center gap-x-1.5">
						<PageIcon icon="globe" className="ph-bold" />
						<PageLink {...basics.website} />
					</div>
				)}
			</div>
		</div>
	);
}
