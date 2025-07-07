<script lang="ts">
	// change the icons to lucide icons
	import { enhance } from '$app/forms';
	import UserIcon from '@lucide/svelte/icons/user';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogoutIcon from '@lucide/svelte/icons/log-out';
	import NotificationIcon from '@lucide/svelte/icons/bell';
	import UserCircleIcon from '@lucide/svelte/icons/user-circle';
	import DotsVerticalIcon from '@lucide/svelte/icons/ellipsis-vertical';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	/**
	 * @type {{
	 *  name: string;
	 *  email: string;
	 *  role: string;
	 *  unit: string;
	 * }}
	 */
	let { user } = $props();
	let loading = $state(false);
	const sidebar = Sidebar.useSidebar();

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

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="size-8 rounded-lg bg-teal-500 px-5 text-white">
							<Avatar.Fallback class="rounded-lg bg-teal-500">
								{user.unit}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
						<DotsVerticalIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<a href="/account" class="flex w-full items-center gap-2">
							<UserCircleIcon />
							Account
						</a>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<form
						method="post"
						action="/sign-out"
						use:enhance={handleSignOut}
						class="flex w-full items-center"
					>
						<button
							class="flex w-full cursor-pointer items-center justify-start gap-2 text-left"
							disabled={loading}
							type="submit"
						>
							<LogoutIcon />
							{loading ? 'Signing out...' : 'Sign out'}
						</button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
