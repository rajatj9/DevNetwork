import React from 'react';

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
						<a href='register.html' className='btn btn-primary'>
							Sign Up
						</a>
						<a href='login.html' className='btn btn-light'>
							Login
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Landing;
