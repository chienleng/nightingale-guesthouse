// create a server POST action to create a booking

import { json, redirect } from '@sveltejs/kit';

export async function POST({ request, cookies, locals: { supabase, safeGetSession } }) {
	const { session } = await safeGetSession();
	if (!session) {
		redirect(303, '/');
	}

	const userId = session.user.id;
	const formData = await request.formData();
	const { start, end } = Object.fromEntries(formData);
	console.log(start, end, userId);

	const res = await supabase
		.from('bookings')
		.insert([{ start_date: start, end_date: end, user_id: userId }])
		.select();

	if (res.error) {
		console.error(res);
		return json(
			{ success: false, message: 'There was an issue, please contact Stan.' },
			{ status: 400 }
		);
	}

	return json({ success: true, message: 'Booking confirmed.', data: res.data }, { status: 201 });
}
