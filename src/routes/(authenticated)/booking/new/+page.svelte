<script>
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import ConfirmDialog from './confirm-dialog.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
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

	const df = new DateFormatter('en-AU', {
		dateStyle: 'medium'
	});

	/** @type {import('bits-ui').DateRange | undefined} */
	let value = $state();

	/** @type {import('@internationalized/date').DateValue | undefined} */
	let startValue = $state();
	/** @type {import('@internationalized/date').DateValue | undefined} */
	let endValue = $state();

	let nights = $derived(startValue && endValue ? nightsBetween(startValue, endValue) : 0);

	// Dialog state
	let isDialogOpen = $state(false);

	/** @param {import('@internationalized/date').DateValue} date */
	function isDateUnavailable(date) {
		// console.log(date);
		// if date is now or in the past, return true
		if (date.compare(new CalendarDate(2025, 7, 7)) <= 0) {
			return true;
		}
		if (date.compare(new CalendarDate(2025, 10, 10)) >= 0) {
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

	async function handlePaymentConfirmed() {
		if (!startValue || !endValue) {
			return;
		}
		isDialogOpen = false;

		// collect the form data and post to server
		const formData = new FormData();
		formData.append('start', `${startValue.year}-${startValue.month}-${startValue.day}`);
		formData.append('end', `${endValue.year}-${endValue.month}-${endValue.day}`);

		const response = await fetch('/api/new-booking', {
			method: 'POST',
			body: formData
		});

		const data = await response.json();
		console.log(data);
		goto('/home');
	}

	let disableBooking = $derived.by(() => {
		console.log(startValue);

		if (!startValue || !endValue) {
			return true;
		}
		if (nights === 0) {
			return true;
		}

		let checkDates = [];
		let start = startValue;
		let end = endValue;
		while (start.compare(end) < 0) {
			checkDates.push(start);
			start = start.add({ days: 1 });
		}
		if (checkDates.some((d) => unavailableDates.some((u) => u.compare(d) === 0))) {
			return true;
		}

		return false;
	});
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<Card.Root class="gap-0 shadow-none">
		<Card.Header class="pb-3 text-center">
			<Card.Title class="font-medium">Preston guest house</Card.Title>
		</Card.Header>

		<Card.Content class="mt-0 flex flex-col gap-4 px-4">
			<img
				src="/guesthouse.jpg"
				alt="House"
				class="h-40 w-full rounded-md object-cover shadow-md saturate-150"
			/>

			<!-- <Popover.Root>
				<Popover.Trigger
					class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
				>
					<CalendarIcon class="size-5" />
					{#if value && value.start}
						{#if value.end}
							{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
								value.end.toDate(getLocalTimeZone())
							)}
						{:else}
							{df.format(value.start.toDate(getLocalTimeZone()))}
						{/if}
					{:else if startValue}
						{df.format(startValue.toDate(getLocalTimeZone()))} —
					{:else if endValue}
						— {df.format(endValue.toDate(getLocalTimeZone()))}
					{:else}
						Select the dates
					{/if}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" align="start">
					<RangeCalendar
						locale="en-AU"
						bind:value
						fixedWeeks={true}
						disableDaysOutsideMonth={false}
						{isDateUnavailable}
						onStartValueChange={(v) => {
							startValue = v;
						}}
						onEndValueChange={(v) => {
							endValue = v;
						}}
						numberOfMonths={1}
					/>
				</Popover.Content>
			</Popover.Root> -->

			<div class="grid grid-cols-2 gap-2">
				<div class="flex flex-col gap-2">
					<Label class="text-muted-foreground text-xs">Check in</Label>
					<Popover.Root>
						<Popover.Trigger
							class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
						>
							{#if startValue}
								{df.format(startValue.toDate(getLocalTimeZone()))}
							{:else}
								<CalendarIcon class="size-5" />
								Date
							{/if}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<RangeCalendar
								locale="en-AU"
								bind:value
								fixedWeeks={true}
								disableDaysOutsideMonth={false}
								{isDateUnavailable}
								onStartValueChange={(v) => {
									startValue = v;
								}}
								onEndValueChange={(v) => {
									endValue = v;
								}}
								numberOfMonths={1}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>

				<div class="flex flex-col gap-2">
					<Label class="text-muted-foreground text-xs">Check out</Label>
					<Popover.Root>
						<Popover.Trigger
							class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
						>
							{#if endValue}
								{df.format(endValue.toDate(getLocalTimeZone()))}
							{:else}
								<CalendarIcon class="size-5" />
								Date
							{/if}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<RangeCalendar
								locale="en-AU"
								bind:value
								fixedWeeks={true}
								disableDaysOutsideMonth={false}
								{isDateUnavailable}
								onStartValueChange={(v) => {
									startValue = v;
								}}
								onEndValueChange={(v) => {
									endValue = v;
								}}
								numberOfMonths={1}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>

				<!-- calculate the number of nights -->
				<div class="flex flex-col gap-2">
					<Label class="text-muted-foreground text-xs">Number of nights</Label>
					<div class={cn(buttonVariants({ variant: 'outline' }))}>
						{#if disableBooking}
							<p class="text-sm font-medium">—</p>
						{:else}
							<p class="text-sm font-medium">{nights}</p>
						{/if}
					</div>
				</div>

				<!-- calculate the number of nights -->
				<div class="flex flex-col gap-2">
					<Label class="text-muted-foreground text-xs">Total costs</Label>
					<div class={cn(buttonVariants({ variant: 'outline' }))}>
						{#if disableBooking}
							<p class=" text-sm font-medium">—</p>
						{:else}
							<p class="text-sm font-medium">${nights * 50}</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Dialog.Root bind:open={isDialogOpen}>
					<Dialog.Trigger
						class={cn(buttonVariants({ variant: 'default' }))}
						disabled={disableBooking}
					>
						Book
					</Dialog.Trigger>
					<ConfirmDialog
						start={df.format(startValue?.toDate(getLocalTimeZone()) ?? new Date())}
						end={df.format(endValue?.toDate(getLocalTimeZone()) ?? new Date())}
						{nights}
						onclick={handlePaymentConfirmed}
					/>
				</Dialog.Root>
				<small class="text-muted-foreground text-center text-xs">
					View <a href="/terms-and-conditions" class="underline">terms and conditions</a>
				</small>
			</div>
		</Card.Content>
	</Card.Root>
</div>
