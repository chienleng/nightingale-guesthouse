import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('user_profiles')
		.select(`role, unit, display_name`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};
