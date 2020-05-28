import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from '../actions/types';
const initState = {
	profile: null,
	profiles: [],
	repos: [],
	loading: true,
	error: {},
};

export default function(state = initState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_PROFILE:
			return {
				...state,
				loading: false,
				profile: payload,
			};
		case PROFILE_ERROR:
			return {
				...state,
				loading: false,
				error: payload,
			};
		case CLEAR_PROFILE:
			return {
				...state,
				profile: null,
				repose: null,
				loading: false,
			};
		default:
			return state;
	}
}
