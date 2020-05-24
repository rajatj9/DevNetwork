import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import NavBar from './components/layout/NavBar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';

// Redux
import { Provider } from 'react-redux'; // Connect redux to react
import store from './store';

const App = () => (
	// Whole application needs to be wraped in Provider
	// Application also needs to be wrapped in Router (One-Page)
	<Provider store={store}>
		<Router>
			<Fragment>
				<NavBar />
				<Route exact path='/' component={Landing} />
				<section className='container'>
					<Alert />
					<Switch>
						<Route exact path='/register' component={Register} />
						<Route exact path='/login' component={Login} />
					</Switch>
				</section>
			</Fragment>
		</Router>
	</Provider>
);
export default App;
