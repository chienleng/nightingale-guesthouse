<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import HousePlusIcon from '@lucide/svelte/icons/house-plus';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

	import { cn } from '$lib/utils.js';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';

	const df = new DateFormatter('en-AU', {
		dateStyle: 'medium'
	});

	/**
	 * @type {import('bits-ui').DateRange | undefined}
	 */
	let value = $state();
	// let value = $state({
	// 	start: new CalendarDate(2025, 6, 12),
	// 	end: new CalendarDate(2025, 7, 15)
	// });

	/**
	 * @type {import('@internationalized/date').DateValue | undefined}
	 */
	let startValue = $state(undefined);

	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');

	const id = $props.id();

	/**
	 * @param {import('@internationalized/date').DateValue} date
	 */
	function isDateUnavailable(date) {
		// console.log(date);
		// if date is now or in the past, return true
		if (date.compare(new CalendarDate(2025, 7, 7)) <= 0) {
			return true;
		}
		return false;
	}
</script>

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants({ variant: 'default' }) + ' w-[150px] cursor-pointer'}>
			<HousePlusIcon class="mr-2 size-4" />
			New booking
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>
					Make changes to your profile here. Click save when you're done.
				</Dialog.Description>
			</Dialog.Header>
			<form class="grid items-start gap-4">
				<div class="grid gap-2">
					<Label for="email-{id}">Email</Label>
					<Input type="email" id="email-{id}" value="shadcn@example.com" />
				</div>
				<div class="grid gap-2">
					<Label for="username-{id}">Username</Label>
					<Input id="username-{id}" value="@shadcn" />
				</div>

				<Popover.Root>
					<Popover.Trigger
						class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
					>
						<CalendarIcon class="mr-2 size-4" />
						{#if value && value.start}
							{#if value.end}
								{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
									value.end.toDate(getLocalTimeZone())
								)}
							{:else}
								{df.format(value.start.toDate(getLocalTimeZone()))}
							{/if}
						{:else if startValue}
							{df.format(startValue.toDate(getLocalTimeZone()))}
						{:else}
							Pick a date
						{/if}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<RangeCalendar
							locale="en-AU"
							bind:value
							fixedWeeks={true}
							disableDaysOutsideMonth={true}
							{isDateUnavailable}
							onStartValueChange={(v) => {
								startValue = v;
							}}
							numberOfMonths={2}
						/>
					</Popover.Content>
				</Popover.Root>

				<Button type="submit">Save changes</Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Dialog.Trigger class={buttonVariants({ variant: 'default' }) + ' w-[150px] cursor-pointer'}>
			<HousePlusIcon class="mr-2 size-4" />
			New booking
		</Dialog.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Edit profile</Drawer.Title>
				<Drawer.Description>
					Make changes to your profile here. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			<form class="grid items-start gap-4 px-4">
				<div class="grid gap-2">
					<Label for="email-{id}">Email</Label>
					<Input type="email" id="email-{id}" value="shadcn@example.com" />
				</div>
				<div class="grid gap-2">
					<Label for="username-{id}">Username</Label>
					<Input id="username-{id}" value="@shadcn" />
				</div>

				<Popover.Root>
					<Popover.Trigger
						class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
					>
						<CalendarIcon class="mr-2 size-4" />
						{#if value && value.start}
							{#if value.end}
								{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
									value.end.toDate(getLocalTimeZone())
								)}
							{:else}
								{df.format(value.start.toDate(getLocalTimeZone()))}
							{/if}
						{:else if startValue}
							{df.format(startValue.toDate(getLocalTimeZone()))}
						{:else}
							Pick a date
						{/if}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<RangeCalendar
							locale="en-AU"
							bind:value
							fixedWeeks={true}
							disableDaysOutsideMonth={true}
							{isDateUnavailable}
							onStartValueChange={(v) => {
								startValue = v;
							}}
							numberOfMonths={1}
						/>
					</Popover.Content>
				</Popover.Root>

				<Button type="submit">Save changes</Button>
			</form>

			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
