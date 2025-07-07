import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { supabase } from '$lib/supabaseClient';

/**
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ url, locals: { safeGetSession } }) => {
	console.log(url);
	const { session } = await safeGetSession();

	// if the user is already logged in return them to the home page
	if (session) {
		redirect(303, '/home');
	}

	const { data } = await supabase.from('countries').select('*');

	return { url: url.origin, form: await superValidate(zod(formSchema)), countries: data ?? [] };
};

/**
 * @type {import('./$types').Actions}
 */
export const actions = {
	default: async (event) => {
		const {
			url,
			request,
			locals: { supabase }
		} = event;
		console.log(event);
		const formData = await request.formData();
		const email = /** @type {string} */ (formData.get('email'));
		// eslint-disable-next-line no-useless-escape
		const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

		if (!validEmail) {
			return fail(400, { errors: { email: 'Please enter a valid email address' }, email });
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}`
			}
		});

		if (error) {
			return fail(400, {
				success: false,
				email,
				message: `There was an issue, please contact Stan.`
			});
		}

		return {
			success: true,
			message: 'Check your email for a sign in link.'
		};
	}
};
