import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { performSearch } from '../../actions/search';
import PostItem from '../posts/PostItem';

const Search = ({ results, performSearch }) => {
	const [queryString, updateQueryString] = useState('');

	return (
		// <div className='profile-grid my-1'>
		<div className='profile-top p-2'>
			<h1 className='large text-primary'>Search</h1>
			<input
				className='App-search-box'
				type='text'
				placeholder='Search for a post'
				value={queryString}
				onChange={(e) => {
					updateQueryString(e.target.value);
					if (queryString.length > 0) {
						performSearch(queryString);
					}
				}}
			/>
			<div className='posts'>
				{results.map((post) => (
					<PostItem key={post._id} post={post._source} showActions={false} />
				))}
			</div>
		</div>
		// </div>
	);
};

Search.propTypes = {
	results: PropTypes.array.isRequired,
	performSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	results: state.search.results,
});

export default connect(mapStateToProps, { performSearch })(Search);
