<script>
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	const df = new DateFormatter('en-AU', {
		dateStyle: 'medium'
	});

	/** @type {import('bits-ui').DateRange | undefined} */
	let value = $state();

	/** @type {import('@internationalized/date').DateValue | undefined} */
	let startValue = $state();

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
		return false;
	}
</script>

<!-- <Label class="mb-2">Select the dates</Label> -->

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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

			<Popover.Root>
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
						{df.format(startValue.toDate(getLocalTimeZone()))}
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
						numberOfMonths={1}
					/>
				</Popover.Content>
			</Popover.Root>

			<div class="flex flex-col gap-2">
				<Button class="w-full">Book</Button>
				<small class="text-muted-foreground text-center text-xs">
					View <a href="/terms-and-conditions" class="underline">terms and conditions</a>
				</small>
			</div>
		</Card.Content>
	</Card.Root>
</div>
