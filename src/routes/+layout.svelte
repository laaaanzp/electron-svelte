<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';

	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	let isElectron = $state(false);

	onMount(() => {
		isElectron = window.electronAPI?.isElectron;
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Warning message for non-Electron environments -->
{#if !isElectron}
	<div class="w-screen h-screen text-3xl font-bold font-mono flex items-center justify-center bg-black text-white">
		<p>
			Error 403: You can't run this application in a regular web browser.
		</p>
	</div>
{:else}
	{@render children()}
{/if}
