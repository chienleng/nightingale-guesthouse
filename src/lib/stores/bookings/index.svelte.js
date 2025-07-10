export default class BookingsStore {
	/**
	 * @type {import('./user-bookings.types').UserBooking[]}
	 */
	userBookings = $state([]);
	/**
	 * @type {import('@internationalized/date').DateValue[]}
	 */
	unavailableDates = $state([]);

	constructor() {
		this.userBookings = [];
		this.unavailableDates = [];
	}
}

export const bookingsStore = new BookingsStore();
