<script>
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { goto } from '$app/navigation';

	import HousePlusIcon from '@lucide/svelte/icons/house-plus';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';

	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import NewBooking from '$lib/components/new-booking.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { onMount } from 'svelte';
	import { bookingsStore } from '$lib/stores/bookings/index.svelte.js';

	let { data } = $props();
	let userBookings = $derived(data.bookings);
	let bookedDates = $derived(data.bookedDates);
	let unavailableDates = $derived.by(() => {
		const dates = [];
		if (bookedDates) {
			bookedDates.forEach((d) => {
				let start = parseDate(d.start_date);
				let end = parseDate(d.end_date);
				while (start.compare(end) < 0) {
					dates.push(start);
					start = start.add({ days: 1 });
				}
			});
		}
		return dates;
	});

	$effect(() => {
		bookingsStore.userBookings = data.bookings;
		bookingsStore.unavailableDates = unavailableDates;
	});

	$inspect('bookingsStore.userBookings', bookingsStore.userBookings);
	$inspect('bookingsStore.unavailableDates', bookingsStore.unavailableDates);

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

	/**
	 * @param {import('@internationalized/date').DateValue} date
	 */
	function isDateUnavailable(date) {
		// console.log(date);
		// if date is now or in the past, return true
		if (date.compare(new CalendarDate(2025, 7, 7)) <= 0) {
			return true;
		}
		if (unavailableDates.some((d) => d.compare(date) === 0)) {
			return true;
		}
		return false;
	}

	/**
	 * @param {import('@internationalized/date').DateValue} startDate
	 * @param {import('@internationalized/date').DateValue} endDate
	 * @returns {number}
	 */
	function nightsBetween(startDate, endDate) {
		// compare() returns -1, 0, or 1 — so we need to count the nights manually
		let nights = 0;
		let cursor = startDate;

		while (endDate.compare(cursor) > 0) {
			nights++;
			cursor = cursor.add({ days: 1 });
		}

		return nights;
	}
</script>

<div class="flex w-full flex-col justify-between gap-4 md:flex-row">
	<div class="flex w-full flex-col gap-4">
		<!-- <h3 class="text-lg font-bold">Upcoming bookings</h3> -->
		{#if userBookings.length > 0}
			<p class="text-muted-foreground text-sm">
				You have {userBookings.length} upcoming bookings.
			</p>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each userBookings.sort((a, b) => new Date(a.start_date) - new Date(b.start_date)) as booking (booking.id)}
					<div class="relative rounded-md border p-4">
						<header class="absolute top-2 right-2">
							<Badge variant="secondary">Booked</Badge>
							<!-- <Badge variant="outline">
								{df.format(new Date(booking.created_at))}
							</Badge> -->
						</header>

						<div>
							<p class="text-lg font-bold">
								{nightsBetween(parseDate(booking.start_date), parseDate(booking.end_date))} nights
							</p>
							<p class="text-sm">
								{df.format(parseDate(booking.start_date).toDate(getLocalTimeZone()))} -
								{df.format(parseDate(booking.end_date).toDate(getLocalTimeZone()))}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-muted-foreground text-sm">You have no upcoming bookings.</p>
		{/if}
		<!-- <marquee>You have no upcoming bookings!</marquee> -->

		<Button
			class="w-[150px] cursor-pointer"
			onclick={() => {
				goto('/booking/new');
			}}
		>
			<HousePlusIcon class="size-5" />
			New booking
		</Button>
		<!-- <NewBooking /> -->
	</div>
	<div>
		<Card.Root class="shadow-sidebar-primary-foreground w-[300px] rounded-md">
			<Card.Header class="border-b">
				<Card.Title class="flex items-center gap-2">
					<CalendarIcon class="size-5" />
					Availability
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<Calendar
					locale="en-AU"
					type="single"
					fixedWeeks={true}
					{isDateUnavailable}
					readonly={true}
				/>
			</Card.Content>
		</Card.Root>
	</div>
</div>
<!-- 
<div class="w-1/2">
	<div class="grid gap-2">
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
	</div>
</div> -->
