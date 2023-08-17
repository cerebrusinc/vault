<script lang="ts">
	import { authed } from "./stores";

	import Auth from "./Auth.svelte";
	import Manager from "./Manager.svelte";
	import "carbon-components-svelte/css/g100.css";

	let authState: boolean = false;
	$: title = authState ? "Vault | Password Manager" : "Auth | Password Manager";

	authed.subscribe((value) => {
		authState = value;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<div class="tainer">
	{#if authState}
		<div style="height: 100%; width: 100%;">
			<Manager />
		</div>
	{:else}
		<div
			style="width: 200px; height: fit-content; display: flex; justify-content: center; align-items: center; flex-direction: column;"
		>
			<Auth />
		</div>
	{/if}
</div>

<style>
	.tainer {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
