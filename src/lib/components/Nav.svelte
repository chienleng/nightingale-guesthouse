<script>
	import { enhance } from '$app/forms';
	let { user } = $props();
	let loading = $state(false);

	/**
	 * @type {import('@sveltejs/kit').SubmitFunction}
	 */
	const handleSignOut = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<nav class="mb-5 flex items-center justify-between border-b border-slate-200 py-5">
	<div class="flex items-center space-x-4">
		<a href="/home" class=" hover:text-sky-900 hover:underline">Guest house</a>
	</div>

	<div class="flex items-center space-x-4 text-sm font-bold">
		<a href="/account" class="text-sky-600 hover:text-sky-900 hover:underline">
			{user.email}
		</a>
		<form method="post" action="/sign-out" use:enhance={handleSignOut}>
			<button
				class="cursor-pointer text-sky-600 hover:text-sky-900 hover:underline"
				disabled={loading}
			>
				{loading ? 'Signing out...' : 'Sign out'}
			</button>
		</form>
	</div>
</nav>
