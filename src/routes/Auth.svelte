<script lang="ts">
	import { authPin, authed } from "./stores";

	import { PasswordInput, Loading } from "carbon-components-svelte";
	import Locked from "carbon-icons-svelte/lib/Locked.svelte";

	let authPinValue: string;
	let isLoading: boolean = false;
	let disabled: boolean = false;

	let warn: boolean = false;
	$: warnText = warn ? "You entered the incorrect auth pin" : "";

	let invalid: boolean = false;
	$: invalidText = invalid ? "Server error, please wait a few moments..." : "";

	$: helperText = !invalid && !warn && isLoading ? "Authorising..." : "";

	authPin.subscribe((value) => {
		authPinValue = value;
	});

	const handleEnter = async () => {
		disabled = true;
		warn = false;
		invalid = false;
		isLoading = true;
		try {
			const req = await fetch("/api/auth", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pin: authPinValue }),
			});

			const { success } = await req.json();

			if (!success) warn = true;
			disabled = false;
			isLoading = false;
			authed.update(() => true);
		} catch {
			warn = false;
			invalid = true;
			disabled = false;
			isLoading = false;
		}
	};

	const onChange = (text: any) => {
		authPin.update(() => text);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		e.key === "Enter" ? handleEnter() : null;
	};
</script>

{#if isLoading}
	<Loading withOverlay={false} small />
{:else}
	<Locked style="margin-bottom: 21px;" size={32} />
{/if}
<PasswordInput
	placeholder="Enter your auth pin"
	labelText="Auth Pin"
	on:input={(e) => {
		// @ts-ignore
		onChange(e.target.value);
	}}
	on:keydown={(e) => onKeyDown(e)}
	{disabled}
	{warn}
	{warnText}
	{invalid}
	{invalidText}
	{helperText}
/>
