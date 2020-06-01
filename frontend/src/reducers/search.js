import { SEARCH_RESULTS, SEARCH_FAILED } from '../actions/types';

const initState = {
	loading: true,
	error: {},
	results: [],
};

export default function (state = initState, action) {
	const { type, payload } = action;
	switch (type) {
		case SEARCH_RESULTS:
			return {
				...state,
				results: payload,
				loading: false,
			};
		case SEARCH_FAILED: {
			return {
				...state,
				results: [],
				loading: false,
				error: payload,
			};
		}
		default:
			return state;
	}
}
