<script lang="ts">
	import { onMount } from "svelte";
	import isURI from "@stdlib/assert-is-uri";
	import {
		getAllPasses,
		addPassword,
		delPassword,
		patchPassword,
		type Password,
	} from "$lib/db";
	import type { ModalInstruction } from "$lib/interfaces";
	import { genPass } from "$lib/others";
	import {
		DataTableSkeleton,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Button,
		Modal,
		TextInput,
		Pagination,
		PaginationSkeleton,
		ButtonSet,
		ToastNotification,
	} from "carbon-components-svelte";

	import FetchUploadCloud from "carbon-icons-svelte/lib/FetchUploadCloud.svelte";
	import Add from "carbon-icons-svelte/lib/Add.svelte";
	import Edit from "carbon-icons-svelte/lib/Edit.svelte";
	import Launch from "carbon-icons-svelte/lib/Launch.svelte";
	import Copy from "carbon-icons-svelte/lib/Copy.svelte";
	import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";

	let dataLoaded: Password[] | null = null;
	let open = false;
	let modalHelper: ModalInstruction | null = null;
	let shouldAlert: boolean = false;

	let usernameValue: string = "";
	let passValue: string = "";
	let serviceValue: string = "";
	let linkValue: string = "";

	let usernameValueP: string = "";
	let passValueP: string = "";
	let serviceValueP: string = "";
	let linkValueP: string = "";

	let buttonText: string = "Add to Vault";
	let buttonTextTwo: string = "Update Vault";

	let isDisabled: boolean = false;
	$: isValid =
		usernameValue.length > 2 &&
		passValue.length > 2 &&
		serviceValue.length > 0 &&
		isURI(linkValue);
	$: isValid2 =
		usernameValue.length > 2 ||
		passValue.length > 2 ||
		serviceValue.length > 0 ||
		isURI(linkValue);

	$: if (!open) {
		usernameValue = "";
		passValue = "";
		serviceValue = "";
		linkValue = "";
	}

	let pageSize = 9;
	let page = 1;
	let filteredRowIds: number[] = [];

	let kind:
		| "error"
		| "info"
		| "info-square"
		| "success"
		| "warning"
		| "warning-alt" = "info";
	let title: string = "";
	let subtitle: string = "";

	const _alert = (
		kind2:
			| "error"
			| "info"
			| "info-square"
			| "success"
			| "warning"
			| "warning-alt",
		title2: string,
		subtitle2: string
	): void => {
		kind = kind2;
		title = title2;
		subtitle = subtitle2;
		shouldAlert = true;

		setTimeout(() => {
			shouldAlert = false;
			title = "";
			subtitle = "";
			kind = "info";
		}, 4001);
	};

	const addPass = async () => {
		_clean();
		buttonText = "Adding...";
		isDisabled = true;
		try {
			const res = await addPassword({
				id: Date.now().toString(),
				key: "",
				link: linkValue,
				password: passValue,
				service: serviceValue,
				username: usernameValue,
				index: -1,
			});

			if (res) {
				const res2 = await getAllPasses();
				open = false;
				dataLoaded = [...res2];
				_alert(
					"success",
					"Data Added",
					"A new password has been added to your Vault."
				);
				isDisabled = false;
			} else {
				isDisabled = false;
				_alert("error", "Error", "Try again in a few minutes.");
				buttonTextTwo = "Add to Vault";
			}
		} catch {
			isDisabled = false;
			_alert("error", "Server Error", "Try again in a few minutes.");
			buttonText = "Add to Vault";
		}
	};

	const editPass = async () => {
		_clean();

		if (usernameValue !== "" && usernameValue.length < 3) {
			_alert(
				"warning",
				"Username Too Short",
				"Make sure your username is 3 or more characters long!"
			);
			return;
		}

		if (passValue !== "" && passValue.length < 3) {
			_alert(
				"warning",
				"Password Too Short",
				"Make sure your password is 3 or more characters long!"
			);
			return;
		}

		if (linkValue !== "" && !isURI(linkValue)) {
			_alert("warning", "Malformed Link", "Make sure the link is accurates!");
			return;
		}

		buttonTextTwo = "Updating...";
		isDisabled = true;
		try {
			if (modalHelper && dataLoaded) {
				const { key, link, password, service, username } =
					dataLoaded[modalHelper.id];
				const res = await patchPassword({
					id: "",
					key,
					link: linkValue === "" ? link : linkValue,
					password: passValue === "" ? password : passValue,
					service: serviceValue === "" ? service : serviceValue,
					username: usernameValue === "" ? username : usernameValue,
				});

				if (res) {
					const res2 = await getAllPasses();
					open = false;
					dataLoaded = [...res2];
					_alert("success", "Vault Updated", "Your Vault is up to date!");
					isDisabled = false;
				} else {
					isDisabled = false;
					_alert("error", "Error", "Try again in a few minutes.");
					buttonTextTwo = "Add to Vault";
				}
			}
		} catch {
			isDisabled = false;
			_alert("error", "Server Error", "Try again in a few minutes.");
			buttonTextTwo = "Update Vault";
		}
	};

	const copyPass = (i: number): void => {
		if (dataLoaded) {
			const { password } = dataLoaded[i];

			navigator.clipboard.writeText(password);

			_alert(
				"success",
				"Password Copied",
				"You can now paste your password wherever you need to!"
			);
		}
	};

	const deletePassword = async (): Promise<void> => {
		if (dataLoaded && modalHelper) {
			isDisabled = true;
			const { key } = dataLoaded[modalHelper.id];
			try {
				const res = await delPassword(key);

				if (res) {
					const res2 = await getAllPasses();

					isDisabled = false;
					open = false;
					dataLoaded = [...res2];
					_alert("success", "Data Deleted", "You now have some free space!");
				} else {
					isDisabled = false;
					open = false;
					modalHelper = null;
					_alert(
						"error",
						"Error",
						"Something went wrong, wait a few moments and try again..."
					);
				}
			} catch {
				isDisabled = false;
				open = false;
				modalHelper = null;
				_alert(
					"error",
					"Server Error",
					"Something went wrong, wait a few moments and try again..."
				);
			}
		}
	};

	const _editHelper = (i: number) => {
		if (dataLoaded) {
			const { link, password, service, username } = dataLoaded[i];
			linkValueP = link;
			passValueP = password;
			serviceValueP = service;
			usernameValueP = username;

			linkValue = "";
			passValue = "";
			serviceValue = "";
			usernameValue = "";
		}
	};

	const _clean = (): void => {
		usernameValue = usernameValue.trim();
		passValue = passValue.trim();
		serviceValue = serviceValue.trim();
	};

	onMount(async () => {
		const res = await getAllPasses();
		dataLoaded = [...res];
	});
</script>

{#if open && modalHelper}
	<Modal
		passiveModal
		bind:open
		modalHeading={modalHelper.heading}
		on:open
		on:close
	>
		{#if modalHelper.type === "CREATE"}
			<TextInput
				bind:value={usernameValue}
				labelText="Username"
				disabled={isDisabled}
				on:click={() => _clean()}
			/>
			<TextInput
				bind:value={passValue}
				labelText="Password"
				helperText="HINT: Shift Click me to generate a password for you"
				disabled={isDisabled}
				on:click={(e) => {
					if (e.shiftKey) passValue = genPass();
					_clean();
				}}
			/>
			<TextInput
				bind:value={serviceValue}
				labelText="Service"
				disabled={isDisabled}
				on:click={() => _clean()}
			/>
			<TextInput
				bind:value={linkValue}
				labelText="Link"
				helperText="The url for the service"
				disabled={isDisabled}
				on:input={(e) => {
					// @ts-ignore
					if (e.detail.length < 7) linkValue = "https://";
					_clean();
				}}
			/>
			<Button
				icon={FetchUploadCloud}
				style="margin-top: 17px;"
				disabled={isDisabled ? true : isValid ? false : true}
				on:click={() => addPass()}>{buttonText}</Button
			>
		{:else if modalHelper.type === "DELETE"}
			<p>This action is irreversible so proceed with caution.</p>
			<Button
				icon={TrashCan}
				style="margin-top: 17px;"
				kind="danger"
				disabled={isDisabled}
				on:click={() => deletePassword()}>Delete</Button
			>
		{:else if modalHelper.type === "EDIT"}
			<TextInput
				bind:value={usernameValue}
				labelText="Username"
				disabled={isDisabled}
				placeholder={usernameValueP}
				on:click={() => _clean()}
			/>
			<TextInput
				bind:value={passValue}
				labelText="Password"
				helperText="HINT: Shift Click me to generate a password for you"
				disabled={isDisabled}
				placeholder={passValueP}
				on:click={(e) => {
					if (e.shiftKey) passValue = genPass();
					_clean();
				}}
			/>
			<TextInput
				bind:value={serviceValue}
				labelText="Service"
				disabled={isDisabled}
				placeholder={serviceValueP}
				on:click={() => _clean()}
			/>
			<TextInput
				bind:value={linkValue}
				labelText="Link"
				helperText="The url for the service"
				disabled={isDisabled}
				placeholder={linkValueP}
				on:input={(e) => {
					// @ts-ignore
					if (e.detail.length < 7) linkValue = "https://";
					_clean();
				}}
			/>
			<Button
				icon={Edit}
				style="margin-top: 17px;"
				disabled={isDisabled ? true : isValid2 ? false : true}
				on:click={() => editPass()}>{buttonTextTwo}</Button
			>
		{/if}
	</Modal>
{/if}

{#if !dataLoaded}
	<DataTableSkeleton
		headers={["Username", "Service", "Actions"]}
		rows={9}
		style="width: 100%"
	/>
	<PaginationSkeleton />
{:else}
	<DataTable
		title="Your Vault"
		stickyHeader
		description={dataLoaded.length === 0
			? "Select 'Add Password' to get started."
			: "Currently saved passwords, this session will end once you close or refesh."}
		headers={[
			{ key: "username", value: "Username" },
			{ key: "service", value: "Service" },
			{ key: "index", value: "Actions" },
		]}
		rows={dataLoaded}
		{page}
		{pageSize}
		style="width: 100%"
	>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch persistent shouldFilterRows bind:filteredRowIds />
				<Button
					icon={Add}
					on:click={() => {
						modalHelper = {
							id: -1,
							heading: "Add a password to your vault",
							type: "CREATE",
						};
						open = true;
					}}>Add Password</Button
				>
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key === "index"}
				<ButtonSet style="margin-top: -15px;">
					<Button
						icon={Edit}
						kind="ghost"
						tooltipPosition="left"
						tooltipAlignment="center"
						iconDescription="edit data"
						style="width: fit-content;"
						on:click={() => {
							_editHelper(cell.value);
							modalHelper = {
								id: cell.value,
								heading: `Update "${
									// @ts-ignore
									dataLoaded[cell.value].service
								}'s" data`,
								type: "EDIT",
							};
							open = true;
						}}
					/>
					<Button
						icon={Copy}
						kind="ghost"
						tooltipPosition="left"
						tooltipAlignment="center"
						iconDescription="copy password"
						style="width: fit-content;"
						on:click={() => copyPass(cell.value)}
					/>
					<Button
						icon={Launch}
						kind="ghost"
						tooltipPosition="left"
						tooltipAlignment="center"
						iconDescription="open link"
						href={`${dataLoaded[cell.value].link}`}
						target="__blank"
						style="width: fit-content;"
					/>
					<Button
						icon={TrashCan}
						kind="danger-ghost"
						tooltipPosition="left"
						tooltipAlignment="center"
						iconDescription="delete data"
						style="width: fit-content;"
						on:click={() => {
							modalHelper = {
								id: cell.value,
								heading: `Delete "${
									// @ts-ignore
									dataLoaded[cell.value].service
								}'s" data?`,
								type: "DELETE",
							};
							open = true;
						}}
					/>
				</ButtonSet>
			{:else}
				{cell.value}
			{/if}
		</svelte:fragment>
	</DataTable>
	<Pagination
		bind:pageSize
		bind:page
		totalItems={filteredRowIds.length}
		pageSizeInputDisabled
	/>
{/if}

{#if shouldAlert}
	<ToastNotification
		style="position: absolute; left: 25px; bottom: 25px; z-index: 99;"
		{kind}
		{title}
		{subtitle}
		hideCloseButton
	/>
{/if}
