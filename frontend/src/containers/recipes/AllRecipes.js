import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Api from '../../helpers/api';
import { addBreadcrumbs, removeBreadcrumbs } from '../../modules/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import { Container, Row, Col } from 'reactstrap';

class AllRecipes extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			index: 0,
			recipes: [],
			breadcrumbs: 'All recipes'
		}
	}

	componentWillUnmount () {
        this.props.removeBreadcrumbs(this.state.breadcrumbs);
	}

	loadNextRecipe = () => {
		const state = this.state;

		Api.get('/recipes/?skip=' + state.index + '&limit=1')
		.then(recipes => {
			if(recipes.value.length > 0) {
				this.setState({
					recipes: [
						...state.recipes,
						recipes.value[0]
					],
					index: state.index + 1
				});
			}
		});
	}

	componentDidMount = () => {
		this.loadNextRecipe();

		this.props.addBreadcrumbs(this.state.breadcrumbs, this.props.match.url);

		window.onscroll = () => {
			if (this.getScrollPercent() >= 80) {
				this.loadNextRecipe();
			}
		}
	}

	getScrollPercent = () => {
		let h = document.documentElement, 
			b = document.body,
			st = 'scrollTop',
			sh = 'scrollHeight';

   		return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
	}

	createRow = (data) => {
		return (
			<Row>
				<Col className="content" lg={{ size: 8, offset: 2 }} xs={{ size: 10, offset: 1 }}>
					<div className="title">{data.title}</div>
					<div className="text">
						<ReactMarkdown source={data.text} />
					</div>
					<Link to={"/recipes/" + data._id } className="show-full-link">Show full recipe</Link>
				</Col>
			</Row>
		)
	}

	render = () => {
		const recipes = this.state.recipes;

		return (
			<>
				<Container>
					{ recipes.map(item => this.createRow(item)) }
				</Container>
			</>
		)
	}
}

const mapStateToProps = ({ recipes, router }) => ({
	recipes,
    location: router.location,
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
{
	addBreadcrumbs,
	removeBreadcrumbs,
    changePage: (page) => push(page)
},
dispatch
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllRecipes);
