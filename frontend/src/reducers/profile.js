import {
	GET_PROFILE,
	PROFILE_ERROR,
	CLEAR_PROFILE,
	UPDATE_PROFILE,
	GET_REPOS,
} from '../actions/types';
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
		case UPDATE_PROFILE:
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
		case GET_REPOS:
			return {
				...state,
				repos: payload,
				loading: false,
			};
		case NO_REPOS:
			return {
				...state,
				repos: [],
				loading: false,
			};
		default:
			return state;
	}
}
