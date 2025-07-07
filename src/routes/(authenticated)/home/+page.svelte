<script>
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';

	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import NewBooking from '$lib/components/new-booking.svelte';
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
		return false;
	}
</script>

<div class="flex w-full flex-col justify-between gap-4 md:flex-row">
	<div class="flex w-full flex-col gap-4">
		<!-- <h3 class="text-lg font-bold">Upcoming bookings</h3> -->
		<p class="text-muted-foreground text-sm">You have no upcoming bookings.</p>
		<!-- <marquee>You have no upcoming bookings!</marquee> -->

		<NewBooking />
	</div>
	<Card.Root class="shadow-sidebar-primary-foreground w-[300px] rounded-md">
		<Card.Header class="border-b">
			<Card.Title>Available dates</Card.Title>
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
