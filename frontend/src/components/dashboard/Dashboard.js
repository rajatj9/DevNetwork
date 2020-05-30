import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';

const Dashboard = ({
	getCurrentProfile,
	auth: { user },
	profile: { profile, loading },
	deleteAccount,
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, []);

	return loading && profile === null ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className='large text-primary'> Dashboard</h1>
			<p classname='Lead'>
				<i className='fas fa-user'></i> Welcome <b>{user && user.name} </b>
			</p>
			<br />
			{profile !== null ? (
				<Fragment>
					<DashboardActions />
					<Experience experience={profile.experience} />
					<Education education={profile.education} />
					<div className='my-2'>
						<button className='btn btn-danger' onClick={() => deleteAccount()}>
							<i className='fas fa-user-minus' /> Delete My Account
						</button>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<p>You have not set up a profile yet, please add some information.</p>
					<Link to='/create-profile' className='btn btn-primary my-1'>
						Create Profile
					</Link>

					<button className='btn btn-danger' onClick={() => deleteAccount()}>
						<i className='fas fa-user-minus' /> Delete My Account
					</button>
				</Fragment>
			)}
		</Fragment>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile,
});

export default connect(
	mapStateToProps,
	{ getCurrentProfile, deleteAccount },
)(Dashboard);
