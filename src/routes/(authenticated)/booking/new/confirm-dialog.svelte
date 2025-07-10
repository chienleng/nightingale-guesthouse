<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils';

	let { start, end, nights, onclick } = $props();
</script>

<Dialog.Content class="sm:max-w-[425px]" portalProps={{}}>
	<Dialog.Header class="">
		<Dialog.Title class="">Confirm your booking</Dialog.Title>
		<Dialog.Description class="">Please check and confirm your booking details.</Dialog.Description>
	</Dialog.Header>
	<div class="grid gap-4 py-4">
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="check-in" class="">Check in</Label>
			<Input id="check-in" value={start} class="col-span-3" disabled type="text" />
		</div>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="check-out" class="">Check out</Label>
			<Input id="check-out" value={end} class="col-span-3" disabled type="text" />
		</div>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="nights" class="">Nights</Label>
			<Input id="nights" value={nights} class="col-span-3" disabled type="text" />
		</div>
	</div>
	<Dialog.Footer class="">
		<!-- <Button class="w-full cursor-pointer">Proceed to payment</Button> -->

		<Dialog.Root>
			<Dialog.Trigger class={cn(buttonVariants({ variant: 'default' }))}>
				Proceed to payment
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]" portalProps={{}}>
				<Dialog.Header class="">
					<Dialog.Title class="">Payment confirmed</Dialog.Title>
					<Dialog.Description class="">
						Please check your email for the booking confirmation.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer class="">
					<Dialog.Close asChild>
						<Button class="w-full cursor-pointer" {onclick}>Close</Button>
					</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Dialog.Footer>
</Dialog.Content>
