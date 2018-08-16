import React, { Component } from 'react';
import Navigator from './Navigator';
import {
	Navbar,
	Alignment,
	Card,
	Callout,
	AnchorButton,
	Icon,
	Position,
	Tooltip,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import './index.css';

const SCOPES = [
	'https://www.googleapis.com/auth/spreadsheets.readonly',
	'profile',
];

class Nav extends Component {
	signOut() {
		const GoogleAuth = window.gapi.auth2.getAuthInstance();
		GoogleAuth.signOut().then(() => {
			this.props.signOut();
		});
	}

	render() {
		const profileImg = this.props.profile && this.props.profile.getImageUrl();

		return (
			<Navbar>
				<Navbar.Group align={Alignment.LEFT}>
					<img src="favicon.ico" width="100" heigth="100" alt="" />
					<Navbar.Divider />
					<Navbar.Heading>Athletia Partner Reports</Navbar.Heading>
				</Navbar.Group>
				{this.props &&
					this.props.authenticated && (
					<Navbar.Group align={Alignment.RIGHT}>
						<img
							style={{ marginRight: '5px' }}
							src={profileImg && profileImg}
							width="40"
							heigth="40"
							alt=""
						/>
						{this.props.profile && this.props.profile.getName()}

						<Tooltip content="Google Logout" position={Position.BOTTOM}>
							<AnchorButton onClick={this.signOut.bind(this)} minimal>
								<Icon icon={IconNames.LOG_OUT} />
							</AnchorButton>
						</Tooltip>
					</Navbar.Group>
				)}
			</Navbar>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticated: false,
			profile: null,
		};
	}

	componentDidMount() {
		// load client for google spreadsheets api
		// load auth2 scope management
		// load signin for the signin button
		window.gapi.load('auth2:client:signin2', () => {
			this.renderSignInButton();
		});
	}

	renderSignInButton() {
		window.gapi.signin2.render('g-signin2', {
			scope: SCOPES.join(' '),
			width: 120,
			height: 35,
			longtitle: false,
			prompt: 'select_account',
			theme: 'dark',
			onsuccess: this.authenticate.bind(this),
			onfaiure: this.setState({ error: { message: 'Error while logging in' } }),
		});
	}

	authenticate() {
		const GoogleAuth = window.gapi.auth2.getAuthInstance();
		const currentUser = GoogleAuth.currentUser && GoogleAuth.currentUser.get();

		const profile = currentUser.getBasicProfile();
		this.setState({ authenticated: true, profile, loading: false });
	}

	signOut() {
		const GoogleAuth = window.gapi.auth2.getAuthInstance();
		GoogleAuth.signOut().then(() => {
			this.setState({
				authenticated: false,
				profile: null,
			});
			this.renderSignInButton();
		});
	}

	render() {
		return (
			<div>
				<Nav
					signOut={this.signOut.bind(this)}
					authenticated={this.state.authenticated}
					profile={this.state.profile}
				/>
				{!this.state.authenticated ? (
					<div>
						<Card style={{ marginTop: '5px' }}>
							<Callout title={'Login with Google'} intent="primary">
								Before we can give you access to your report, we need you to log
								in with your Google Account.
								<div style={{ marginTop: '10px' }} id="g-signin2" />
							</Callout>
						</Card>
					</div>
				) : (
					<Navigator />
				)}
			</div>
		);
	}
}

export default App;
