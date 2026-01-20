import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	DotsSixVerticalIcon,
	DotsThreeVerticalIcon,
	EyeClosedIcon,
	EyeIcon,
	PencilSimpleLineIcon,
	PlusIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { Reorder, useDragControls } from "motion/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { useResumeStore } from "@/components/resume/store/resume";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import type { SectionItem as SectionItemType, SectionType } from "@/schema/resume/data";
import { cn } from "@/utils/style";

type Props<T extends SectionItemType> = {
	type: SectionType;
	item: T;
	title: string;
	subtitle?: string;
};

export function SectionItem<T extends SectionItemType>({ type, item, title, subtitle }: Props<T>) {
	const confirm = useConfirm();
	const controls = useDragControls();
	const { openDialog } = useDialogStore();
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const onToggleVisibility = () => {
		updateResumeData((draft) => {
			const section = draft.sections[type];
			if (!("items" in section)) return;
			const index = section.items.findIndex((_item) => _item.id === item.id);
			if (index === -1) return;
			section.items[index].hidden = !section.items[index].hidden;
		});
	};

	const onUpdate = () => {
		openDialog(`resume.sections.${type}.update`, item);
	};

	const onDuplicate = () => {
		openDialog(`resume.sections.${type}.create`, item);
	};

	const onDelete = async () => {
		const confirmed = await confirm("Are you sure you want to delete this item?", {
			confirmText: "Delete",
			cancelText: "Cancel",
		});

		if (!confirmed) return;

		updateResumeData((draft) => {
			const section = draft.sections[type];
			if (!("items" in section)) return;
			const index = section.items.findIndex((_item) => _item.id === item.id);
			if (index === -1) return;
			section.items.splice(index, 1);
		});
	};

	return (
		<Reorder.Item
			key={item.id}
			value={item}
			dragListener={false}
			dragControls={controls}
			initial={{ opacity: 1, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="group relative flex h-18 select-none border-b"
		>
			<div
				className="flex cursor-ns-resize touch-none items-center px-1.5 opacity-40 transition-[background-color,opacity] hover:bg-secondary/20 group-hover:opacity-100"
				onPointerDown={(e) => {
					e.preventDefault();
					controls.start(e);
				}}
			>
				<DotsSixVerticalIcon />
			</div>

			<button
				onClick={onUpdate}
				className={cn(
					"flex flex-1 flex-col items-start justify-center space-y-0.5 pl-1.5 text-left opacity-100 transition-opacity hover:bg-secondary/20 focus:outline-none focus-visible:ring-1",
					item.hidden && "opacity-50",
				)}
			>
				<div className="line-clamp-1 font-medium">{title}</div>
				{subtitle && <div className="line-clamp-1 text-muted-foreground text-xs">{subtitle}</div>}
			</button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="flex cursor-context-menu items-center px-1.5 opacity-40 transition-[background-color,opacity] hover:bg-secondary/20 focus:outline-none focus-visible:ring-1 group-hover:opacity-100">
						<DotsThreeVerticalIcon />
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={onToggleVisibility}>
							{item.hidden ? <EyeIcon /> : <EyeClosedIcon />}
							{item.hidden ? <Trans>Show</Trans> : <Trans>Hide</Trans>}
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={onUpdate}>
							<PencilSimpleLineIcon />
							<Trans>Update</Trans>
						</DropdownMenuItem>

						<DropdownMenuItem onSelect={onDuplicate}>
							<CopySimpleIcon />
							<Trans>Duplicate</Trans>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem variant="destructive" onSelect={onDelete}>
							<TrashSimpleIcon />
							<Trans>Delete</Trans>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</Reorder.Item>
	);
}

type AddButtonProps = {
	type: SectionType | "custom";
	children: React.ReactNode;
};

export function SectionAddItemButton({ type, children }: AddButtonProps) {
	const { openDialog } = useDialogStore();

	const handleAdd = () => {
		openDialog(`resume.sections.${type}.create`, undefined);
	};

	return (
		<button
			type="button"
			onClick={handleAdd}
			className="flex w-full items-center gap-x-2 px-3 py-4 font-medium hover:bg-secondary/20 focus:outline-none focus-visible:ring-1"
		>
			<PlusIcon />
			{children}
		</button>
	);
}
