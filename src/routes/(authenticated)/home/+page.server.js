import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data } = await supabase.from('bookings').select('*').eq('user_id', session.user.id);
	const { data: bookedDates } = await supabase.from('bookings').select('start_date, end_date');

	return { bookings: data ?? [], bookedDates: bookedDates ?? [] };
};
