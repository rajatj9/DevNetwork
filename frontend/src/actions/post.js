import axios from 'axios';
import { setAlert } from './alert';
import {
	GET_POSTS,
	POST_ERROR,
	UPDATE_LIKES,
	UPDATE_PROFILE,
	DELETE_POST,
	ADD_POST,
	GET_POST,
	ADD_COMMENT,
	REMOVE_COMMENT,
} from './types';

// Get all posts
export const getPosts = () => async dispatch => {
	try {
		const res = await axios.get('/api/post');
		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get post by id
export const getPost = id => async dispatch => {
	try {
		const res = await axios.get(`/api/post/${id}`);
		dispatch({
			type: GET_POST,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Add like
export const addLike = post_id => async dispatch => {
	try {
		const res = await axios.put(`/api/post/like/${post_id}`);
		dispatch({
			type: UPDATE_LIKES,
			payload: { post_id, likes: res.data },
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// remove like
export const removeLike = post_id => async dispatch => {
	try {
		const res = await axios.put(`/api/post/unlike/${post_id}`);
		dispatch({
			type: UPDATE_LIKES,
			payload: { post_id, likes: res.data },
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Delete post
export const removePost = post_id => async dispatch => {
	if (window.confirm('Are you sure you want to delete this post?')) {
		try {
			const res = await axios.delete(`/api/post/${post_id}`);
			dispatch({
				type: DELETE_POST,
				payload: post_id,
			});
			dispatch(setAlert('Post removed!', 'success'));
		} catch (err) {
			dispatch({
				type: POST_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
	}
};

export const addPost = formData => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.post('/api/post', formData, config);

		dispatch({
			type: ADD_POST,
			payload: res.data,
		});
		dispatch(setAlert('Post Added!', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const addComment = (post_id, formData) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.post(
			`/api/post/comment/${post_id}`,
			formData,
			config,
		);

		dispatch({
			type: ADD_COMMENT,
			payload: res.data,
		});
		dispatch(setAlert('Comment Added!', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const deleteComment = (post_id, comment_id) => async dispatch => {
	try {
		const res = await axios.delete(
			`/api/post/comment/${post_id}/${comment_id}`,
		);

		dispatch({
			type: REMOVE_COMMENT,
			payload: comment_id,
		});
		dispatch(setAlert('Comment Added!', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};
