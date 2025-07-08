<script>
	import { page } from '$app/state';

	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import HouseIcon from '@lucide/svelte/icons/house';
	import BookIcon from '@lucide/svelte/icons/book';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavUser from './nav-user.svelte';

	let { user } = $props();

	// Menu items.
	const items = [
		{
			title: 'Guest house',
			url: '/home',
			icon: HouseIcon
		},
		{
			title: 'Guide',
			url: '/guide',
			icon: BookIcon
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Nightingale Preston</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a
										href={item.url}
										{...props}
										class:bg-sidebar-accent={item.url === page.url.pathname}
										class:border={true}
										class:border-transparent={item.url !== page.url.pathname}
										class:hover:border-gray-300={item.url === page.url.pathname}
									>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
