import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CategoriesPage from './CategoriesPage';
import ItemsPage from './ItemsPage';

class Recipes extends React.Component {
	render = () => {
		const location = this.props.location;

		return (
			<Switch location={location}>
				<Route exact path="/" component={CategoriesPage} />
				<Route path="/categories/:id" component={ItemsPage} />
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
