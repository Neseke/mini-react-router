import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Callout, Code, Card } from '@blueprintjs/core';
import getPartners from './utils';

class Dashboard extends Component {
	render() {
		return (
			<div
				style={{ textAlign: 'center', backgroundColor: 'black' }}
				// eslint-disable-next-line
				dangerouslySetInnerHTML={{ __html: this.props.iframe }}
			/>
		);
	}
}

class Navigator extends Component {
	constructor(props) {
		super(props);

		this.state = {
			parnters: [],
			error: null,
		};
	}

	componentWillMount() {
		getPartners(
			partners => this.setState({ partners }),
			error => this.setState({ error })
		);
	}

	render() {
		const { error } = this.state;

		if (error) {
			const { error } = this.state.error.result;

			if (error.code === 403) {
				return (
					<Card>
						<Callout>
							You are not allowed to see the data you are trying to get access
							to. If you think you should be allowed, please write an Email to{' '}
							<b>Marcel.Doukas@athletia.net</b>. While doing so, please provide
							following information:
							<ul>
								<li>For which report do you need access?</li>
								<li>Which URL did you try to access?</li>
								<li>Which company do you belong to?</li>
								<li>Which is the Email Adress you tried to access with?</li>
							</ul>
							Thank you!
						</Callout>
					</Card>
				);
			}

			const statusText =
				error.statusText ||
				error.message ||
				'An error occured while loading the report.';

			return <p>{statusText}</p>;
		}

		if (this.state.partners && this.state.partners.length > 0) {
			return (
				<Router>
					<Switch>
						{this.state.partners &&
							this.state.partners.map(partner => (
								<Route
									key={partner.uri}
									path={`/${partner.uri}`}
									render={props => (
										<Dashboard
											{...props}
											partners={this.state.partners}
											iframe={partner.iframe}
										/>
									)}
								/>
							))}
						<Route
							component={() => (
								<Card style={{ marginTop: '5px' }}>
									<Callout
										title={'404 - There is nothing here!'}
										intent="danger">
										<p>
											The URL you entered seems not to be valid. It should
											follow the pattern{' '}
											<Code>
												https://www.athletia.net/reports/your-report-name
											</Code>, while <Code>your-report-name</Code> is an
											identifier for your report.
										</p>
										<p>
											If you have further questions, feel free to contact{' '}
											<b>Marcel.Doukas@athletia.net</b>
										</p>
									</Callout>
								</Card>
							)}
						/>
					</Switch>
				</Router>
			);
		}
		return <div className="loader" />;
	}
}

export default Navigator;
