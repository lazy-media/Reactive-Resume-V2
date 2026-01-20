import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CircleNotchIcon,
	CopySimpleIcon,
	FolderOpenIcon,
	LockSimpleIcon,
	LockSimpleOpenIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { toast } from "sonner";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { BaseCard } from "./base-card";

type ResumeCardProps = React.ComponentProps<"div"> & {
	resume: RouterOutput["resume"]["list"][number];
};

export function ResumeCard({ resume, ...props }: ResumeCardProps) {
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();

	const { data: screenshotData, isLoading } = useQuery(
		orpc.printer.getResumeScreenshot.queryOptions({ input: { id: resume.id } }),
	);

	const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());
	const { mutate: setLockedResume } = useMutation(orpc.resume.setLocked.mutationOptions());

	const imageSrc = screenshotData?.url;

	const updatedAt = useMemo(() => {
		return new Date(resume.updatedAt).toLocaleDateString();
	}, [resume.updatedAt]);

	const handleUpdate = () => {
		openDialog("resume.update", resume);
	};

	const handleDuplicate = () => {
		openDialog("resume.duplicate", resume);
	};

	const handleToggleLock = async () => {
		if (!resume.isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});

			if (!confirmation) return;
		}

		setLockedResume(
			{ id: resume.id, isLocked: !resume.isLocked },
			{
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	};

	const handleDelete = async () => {
		const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});

		if (!confirmation) return;

		const toastId = toast.loading(t`Deleting your resume...`);

		deleteResume(
			{ id: resume.id },
			{
				onSuccess: () => {
					toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
				},
				onError: (error) => {
					toast.error(error.message, { id: toastId });
				},
			},
		);
	};

	return (
		<div {...props}>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<Link to="/builder/$resumeId" params={{ resumeId: resume.id }} className="cursor-default">
						<BaseCard title={resume.name} description={t`Last updated on ${updatedAt}`} tags={resume.tags}>
							{isLoading || !imageSrc ? (
								<div className="flex size-full items-center justify-center">
									<CircleNotchIcon weight="thin" className="size-12 animate-spin" />
								</div>
							) : (
								<img
									src={imageSrc}
									alt={resume.name}
									className={cn("size-full object-cover transition-all", resume.isLocked && "blur-xs")}
								/>
							)}

							<ResumeLockOverlay isLocked={resume.isLocked} />
						</BaseCard>
					</Link>
				</ContextMenuTrigger>

				<ContextMenuContent>
					<ContextMenuItem asChild>
						<Link to="/builder/$resumeId" params={{ resumeId: resume.id }}>
							<FolderOpenIcon />
							<Trans>Open</Trans>
						</Link>
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem disabled={resume.isLocked} onSelect={handleUpdate}>
						<PencilSimpleLineIcon />
						<Trans>Update</Trans>
					</ContextMenuItem>

					<ContextMenuItem onSelect={handleDuplicate}>
						<CopySimpleIcon />
						<Trans>Duplicate</Trans>
					</ContextMenuItem>

					<ContextMenuItem onSelect={handleToggleLock}>
						{resume.isLocked ? <LockSimpleOpenIcon /> : <LockSimpleIcon />}
						{resume.isLocked ? <Trans>Unlock</Trans> : <Trans>Lock</Trans>}
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem variant="destructive" disabled={resume.isLocked} onSelect={handleDelete}>
						<TrashSimpleIcon />
						<Trans>Delete</Trans>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
}

function ResumeLockOverlay({ isLocked }: { isLocked: boolean }) {
	return (
		<AnimatePresence>
			{isLocked && (
				<motion.div
					key="resume-lock-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.6 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<div className="flex items-center justify-center rounded-full bg-popover p-6">
						<LockSimpleIcon weight="thin" className="size-12" />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
