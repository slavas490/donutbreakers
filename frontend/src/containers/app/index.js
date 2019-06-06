import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Categories from '../categories';
import Recipes from '../recipes';
import Articles from '../articles';
import { setCategories } from '../../modules/categories';
import Breadcrumbs from './Breadcrumbs';
import Api from '../../helpers/api';

class App extends React.Component {
	loadCategories = () => {
		Api.get('/categories')
		.then(categories => {
			categories = categories.value;

			if(categories && categories.length > 0) {
				// get root categories
				let list = categories.filter(item => item.parent === null);

				list = list.map(item => {
					return ({
						...item,
						key: item._id,
						label: item.title
					})
				});

				while (list.length !== categories.length) {
					for (let i in categories) {

						// if current category is not root one
						if (categories[i].parent !== null) {

							// search for existed catergory in the list
							let parentCategory = list.find(item => item._id === categories[i].parent._id);

							// if parent category exists
							if (parentCategory) {
								if (!parentCategory.nodes) {
									parentCategory.nodes = [];
								}

								let childExists = parentCategory.nodes.find(item => item._id === categories[i]._id);
								
								// if current category does not exist in parent nodes list
								if (!childExists) {
									categories[i].key = categories[i]._id;
									categories[i].label = categories[i].title;

									// add child to the parent nodes list
									parentCategory.nodes.push(categories[i]);

									// add processed category to the list
									list.push(categories[i]);
								}
							}
						}
					}
				}

				this.props.setCategories(list.filter(item => item.parent === null));
			}
		});
	}

	componentDidMount = () => {
		this.loadCategories();
	}

	render = () => {
		const location = this.props.location;

		return (
			<>
				<div className="header">
					<Link className="logo" to="/">
						<div>
							<span className="before">d</span>
							<img src="/images/logo.png" alt="logo" />
							<span className="after">nut</span>
							<span className="separate">breakers</span>
						</div>
					</Link>
					<div className="quick-links">
						<Link to="/recipes">Recipes</Link>
						 | 
						<Link to="/articles">Articles</Link>
					</div>
				</div>

				<Breadcrumbs />

				<Switch location={location}>
					<Route exact path="/" component={Categories} />
					<Route path="/categories" component={Categories} />
					<Route path="/recipes" component={Recipes} />
					<Route path="/articles" component={Articles} />
				</Switch>
			</>
		);
	}
}

const mapStateToProps = ({ router }) => ({
    location: router.location
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
{
	setCategories,
    changePage: (page) => push(page)
},
dispatch
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
