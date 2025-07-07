<script>
	import RangeCalendar from "$lib/components/ui/range-calendar/range-calendar.svelte";
	import { CalendarDate } from "@internationalized/date";
	let value = $state({
		start: new CalendarDate(2025, 6, 12),
		end: new CalendarDate(2025, 7, 15),
	});
</script>

<RangeCalendar bind:value class="rounded-lg border shadow-sm" numberOfMonths={2} />