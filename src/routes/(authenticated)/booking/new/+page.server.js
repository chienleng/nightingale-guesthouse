import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: bookedDates } = await supabase.from('bookings').select('start_date, end_date');

	return { bookedDates: bookedDates ?? [] };
};
