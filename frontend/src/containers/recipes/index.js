import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AllRecipes from './AllRecipes';
import RecipePage from './RecipePage';

class Recipes extends React.Component {
	routerUrl = (path) => {
		return this.props.match.url + path;
	}

	render = () => {
		const location = this.props.location;
		
		return (
			<Switch location={location}>
				<Route exact path={this.routerUrl('/')} component={AllRecipes} />
				<Route path={this.routerUrl('/:id')} component={RecipePage} />
			</Switch>
		)
	}
}

const mapStateToProps = ({ router }) => ({
    location: router.location,
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
{
    changePage: (page) => push(page)
},
dispatch
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Recipes);
