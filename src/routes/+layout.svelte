<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	let { children, data } = $props();
	let { supabase, session } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="min-h-screen">
	{@render children()}
</div>
