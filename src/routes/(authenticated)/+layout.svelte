<script>
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	let { children, data } = $props();
	let user = $derived(data.user);
	let profile = $derived(data.profile);

	let sidebarUser = $derived({
		name: profile?.display_name,
		email: user.email,
		role: profile?.role,
		unit: profile?.unit
	});

	// $inspect(data);

	$inspect(user, profile);
</script>

<!-- 
<div class="mx-auto min-h-[calc(100vh-50px)] max-w-7xl px-4 sm:px-6 lg:px-8">
	<Nav {user} />

	{@render children()}
</div> -->

<Sidebar.Provider>
	<AppSidebar user={sidebarUser} />

	<Sidebar.Inset>
		<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />

			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Page>Your bookings</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main class="p-5">
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
