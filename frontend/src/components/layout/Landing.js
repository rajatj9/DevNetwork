import React from 'react';
import { Link } from 'react-router-dom';
const Landing = () => {
	return (
		<section className='landing'>
			<div className='dark-overlay'>
				<div className='landing-inner'>
					<h1 className='x-large'>A network for developers</h1>
					<p className='lead'>
						A platform for developrs to showcase their profile and experiences
						and connect with other developers.
					</p>
					<div className='buttons'>
						<Link to='/register' className='btn btn-primary'>
							Sign Up
						</Link>
						<Link to='/login' className='btn btn-light'>
							Login
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Landing;
