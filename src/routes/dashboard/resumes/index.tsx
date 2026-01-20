import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { ReadCvLogoIcon, SortAscendingIcon, TagIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { MultipleCombobox } from "@/components/ui/multiple-combobox";
import { Separator } from "@/components/ui/separator";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { DashboardHeader } from "../-components/header";
import { CreateResumeCard } from "./-components/create-card";
import { ImportResumeCard } from "./-components/import-card";
import { ResumeCard } from "./-components/resume-card";

type SortOption = "lastUpdatedAt" | "createdAt" | "name";

const searchSchema = z.object({
	tags: z.array(z.string()).default([]),
	sort: z.enum(["lastUpdatedAt", "createdAt", "name"]).default("lastUpdatedAt"),
});

export const Route = createFileRoute("/dashboard/resumes/")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
	search: {
		middlewares: [stripSearchParams({ tags: [], sort: "lastUpdatedAt" })],
	},
});

function RouteComponent() {
	const { i18n } = useLingui();
	const { tags, sort } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const { data: allTags } = useQuery(orpc.resume.tags.list.queryOptions());
	const { data: resumes } = useQuery(orpc.resume.list.queryOptions({ input: { tags, sort } }));

	const tagOptions = useMemo(() => {
		if (!allTags) return [];
		return allTags.map((tag) => ({ value: tag, label: tag }));
	}, [allTags]);

	const sortOptions = useMemo(() => {
		return [
			{ value: "lastUpdatedAt", label: i18n.t("Last Updated") },
			{ value: "createdAt", label: i18n.t("Created") },
			{ value: "name", label: i18n.t("Name") },
		];
	}, [i18n]);

	return (
		<div className="space-y-4">
			<DashboardHeader icon={ReadCvLogoIcon} title={t`Resumes`} />

			<Separator />

			<div className="flex items-center">
				<Combobox
					value={sort}
					options={sortOptions}
					onValueChange={(value) => {
						if (!value) return;
						navigate({ search: { tags, sort: value as SortOption } });
					}}
					buttonProps={{
						title: t`Sort by`,
						variant: "ghost",
						children: (_, option) => (
							<>
								<SortAscendingIcon />
								{option?.label}
							</>
						),
					}}
				/>

				<MultipleCombobox
					value={tags}
					options={tagOptions}
					onValueChange={(value) => {
						navigate({ search: { tags: value, sort } });
					}}
					buttonProps={{
						variant: "ghost",
						title: t`Filter by`,
						className: cn({ hidden: tagOptions.length === 0 }),
						children: (_, options) => (
							<>
								<TagIcon />
								{options.map((option) => (
									<Badge key={option.value} variant="outline">
										{option.label}
									</Badge>
								))}
							</>
						),
					}}
				/>
			</div>

			<div className="grid 3xl:grid-cols-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				<motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
					<CreateResumeCard />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -50 }}
					transition={{ delay: 0.05 }}
				>
					<ImportResumeCard />
				</motion.div>

				<AnimatePresence>
					{resumes?.map((resume, index) => (
						<motion.div
							layout
							key={resume.id}
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, y: -50, filter: "blur(12px)" }}
							transition={{ delay: (index + 2) * 0.05 }}
						>
							<ResumeCard resume={resume} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
