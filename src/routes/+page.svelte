<script>
	import { SendHorizontal, CircleDotDashed, MessageCircleWarning } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	/**
	 * @type {import('./$types').ActionData}
	 */
	export let form;
	let loading = false;

	/**
	 * @type {import('./$types').SubmitFunction}
	 */
	const handleSubmit = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Guesthouse</title>
</svelte:head>

<form
	class="grid h-[calc(100vh-100px)] place-items-center"
	method="POST"
	use:enhance={handleSubmit}
>
	<div class="w-full max-w-lg px-4 text-slate-900">
		{#if form?.message === undefined}
			<div class="flex items-center gap-1 text-sm">
				<label for="email" class="sr-only">Sign in</label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="Enter your email"
					value={form?.email ?? ''}
				/>
				<Button type="submit">
					{#if loading}
						Sending
						<CircleDotDashed class="size-4 animate-spin" strokeWidth={1.5} />
					{:else}
						Send sign in link
						<SendHorizontal class="size-4" strokeWidth={1.5} />
					{/if}
				</Button>
			</div>
		{/if}
		{#if form?.errors?.email}
			<div class="mt-4 rounded-lg bg-amber-800/10 px-4 py-2 text-sm font-semibold text-amber-900">
				{form?.errors?.email}
			</div>
		{/if}

		{#if form?.message !== undefined}
			{#if form?.success}
				<div class="mt-4 rounded-lg bg-slate-800/10 px-4 py-2 text-sm font-semibold text-slate-900">
					{form?.message}
				</div>
			{:else}
				<div
					class="mt-4 flex items-center gap-1 rounded-lg bg-amber-800/10 px-4 py-2 text-sm font-semibold text-amber-900"
				>
					<MessageCircleWarning class="inline size-4" strokeWidth={1.5} />
					<span>
						There is a problem with your email, please contact
						<a href="mailto:steven@steventan.com.au" class="underline">support</a>.
					</span>
				</div>
			{/if}
		{/if}
	</div>
</form>
