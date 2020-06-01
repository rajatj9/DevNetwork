import { SEARCH_RESULTS, SEARCH_FAILED } from './types';
import { setAlert } from './alert';
import axios from 'axios';

export const performSearch = (query) => async (dispatch) => {
	try {
		const res = await axios.get(`api/post/find/${query}`);

		dispatch({
			type: SEARCH_RESULTS,
			payload: res.data.hits,
		});
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: SEARCH_FAILED,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};
