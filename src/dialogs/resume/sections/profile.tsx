import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { AtIcon, PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useForm, useFormContext, useFormState } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { IconPicker } from "@/components/input/icon-picker";
import { URLInput } from "@/components/input/url-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { type DialogProps, useDialogStore } from "@/dialogs/store";
import { profileItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";
import { cn } from "@/utils/style";

const formSchema = profileItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateProfileDialog({ data }: DialogProps<"resume.sections.profiles.create">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.hidden ?? false,
			icon: data?.icon ?? "acorn",
			network: data?.network ?? "",
			username: data?.username ?? "",
			website: data?.website ?? { url: "", label: "" },
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResumeData((draft) => {
			draft.sections.profiles.items.push(data);
		});
		closeDialog();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PlusIcon />
					<Trans>Create a new profile</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
					<ProfileForm />

					<DialogFooter className="sm:col-span-full">
						<Button variant="ghost" onClick={closeDialog}>
							<Trans>Cancel</Trans>
						</Button>

						<Button type="submit" disabled={form.formState.isSubmitting}>
							<Trans>Create</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

export function UpdateProfileDialog({ data }: DialogProps<"resume.sections.profiles.update">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			hidden: data.hidden,
			icon: data.icon,
			network: data.network,
			username: data.username,
			website: data.website,
		},
	});

	const onSubmit = (data: FormValues) => {
		updateResumeData((draft) => {
			const index = draft.sections.profiles.items.findIndex((item) => item.id === data.id);
			if (index === -1) return;
			draft.sections.profiles.items[index] = data;
		});
		closeDialog();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Update an existing profile</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
					<ProfileForm />

					<DialogFooter className="sm:col-span-full">
						<Button variant="ghost" onClick={closeDialog}>
							<Trans>Cancel</Trans>
						</Button>

						<Button type="submit" disabled={form.formState.isSubmitting}>
							<Trans>Save Changes</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

function ProfileForm() {
	const form = useFormContext<FormValues>();
	const networkState = useFormState({ control: form.control, name: "network" });

	const isNetworkInvalid = useMemo(() => {
		return networkState.errors && Object.keys(networkState.errors).length > 0;
	}, [networkState]);

	return (
		<>
			<div className={cn("flex items-end", isNetworkInvalid && "items-center")}>
				<FormField
					control={form.control}
					name={"icon"}
					render={({ field }) => (
						<FormItem className="shrink-0">
							<FormControl>
								<IconPicker {...field} popoverProps={{ modal: true }} className="rounded-r-none! border-r-0!" />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="network"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>
								<Trans>Network</Trans>
							</FormLabel>
							<FormControl>
								<Input className="rounded-l-none!" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="username"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Username</Trans>
						</FormLabel>
						<InputGroup>
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<AtIcon />
								</InputGroupText>
							</InputGroupAddon>

							<FormControl>
								<InputGroupInput {...field} />
							</FormControl>
						</InputGroup>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="website"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<FormLabel>
							<Trans>Website</Trans>
						</FormLabel>
						<FormControl>
							<URLInput {...field} value={field.value} onChange={field.onChange} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
