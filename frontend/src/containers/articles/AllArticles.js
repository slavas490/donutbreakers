import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Api from '../../helpers/api';
import ReactMarkdown from 'react-markdown';
import { Container, Row, Col } from 'reactstrap';
import { addBreadcrumbs, removeBreadcrumbs } from '../../modules/breadcrumbs';

class AllArticles extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			index: 0,
			articles: [],
			breadcrumbs: 'All articles'
		}
	}

	componentWillUnmount () {
        this.props.removeBreadcrumbs(this.state.breadcrumbs);
	}

	loadNextArticle = () => {
		const state = this.state;
	
		Api.get('/articles/?skip=' + state.index + '&limit=1')
		.then(articles => {
			if(articles.value.length > 0) {
				this.setState({
					articles: [
						...state.articles,
						articles.value[0]
					],
					index: state.index + 1
				});
			}
		});
	}

	componentDidMount = () => {
		this.loadNextArticle();

		this.props.addBreadcrumbs(this.state.breadcrumbs, this.props.match.url);

		window.onscroll = () => {
			if (this.getScrollPercent() >= 80) {
				this.loadNextArticle();
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
					<Link to={"/articles/" + data._id } className="show-full-link">Show full article</Link>
				</Col>
			</Row>
		)
	}

	render = () => {
		const articles = this.state.articles;

		return (
			<>
				<Container>
					{ articles.map(item => this.createRow(item)) }
				</Container>
			</>
		)
	}
}

const mapStateToProps = ({ router }) => ({
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
)(AllArticles);
