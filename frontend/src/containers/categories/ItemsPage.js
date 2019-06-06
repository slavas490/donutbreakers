import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Api from '../../helpers/api';
import ReactMarkdown from 'react-markdown';
import { addBreadcrumbs, removeBreadcrumbs } from '../../modules/breadcrumbs';
import { Container, Row, Col } from 'reactstrap';
import ScrollMenu from 'react-horizontal-scrolling-menu';

class ItemsPage extends React.Component {
	constructor (props) {
        super(props);
        
        this.state = {
            recipes: [],
            articles: [],
            isLoadDone: false,
        };
    }

    initialize = async(props = this.props) => {
        const id = props.match.params.id;
        let breadcrumbs = [];

        const pushBreadcrumbs = (item) => {
            if (item) {
                if (item.parent) {
                    pushBreadcrumbs(item.parent);
                }

                breadcrumbs.push(item);
            }
        };

        try {
            const category = await this.getCategory(props);

            if (!category) {
                throw new Error('category not foud');
            }

            const articles = await Api.get('/categories/' + id + '/articles');
            const recipes = await Api.get('/categories/' + id + '/recipes');

            pushBreadcrumbs(category);

            this.deinitialize(props);

            for(let i in breadcrumbs) {
                let item = breadcrumbs[i];
                props.addBreadcrumbs(item.title, '/categories/' + item._id);
            }

            this.setState({
                recipes: recipes.value,
                articles: articles.value,
                isLoadDone: true,
                breadcrumbs
            });
        }
        catch (error) {
            let { history } = props;
            
            history.push({
                pathname: '/'
            });
        }
    }

    deinitialize = (props = this.props) => {
        const breadcrumbs = this.state.breadcrumbs;

        for(let i in breadcrumbs) {
            props.removeBreadcrumbs(breadcrumbs[i].title);
        }
    }

    componentWillUpdate (nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.initialize(nextProps);
        }
    }
    
    componentWillUnmount () {
        this.deinitialize();
	}

	componentDidMount = () => {
        this.initialize();
    }

    getCategory = (props = this.props) => {
        const id = props.match.params.id;

        return Api.get('/categories/' + id)
        .then(category => {
            return category ? category.value : null;
        })
        .catch(error => {
            console.log('getCategory() error: ' + error);
        });
    } 

    createRow = (data, key) => {
        return (
			<Row key={key}>
				<Col className="content" lg={{ size: 8, offset: 2 }} xs={{ size: 10, offset: 1 }}>
					{ data }
				</Col>
			</Row>
		)
    }
    
    createRecipeRow = (data) => {
		return this.createRow(
			<>
                <div className="title">{data.title}</div>
                <div className="text">
                    <ReactMarkdown source={data.text} />
                </div>
                <Link to={"/recipes/" + data._id } className="show-full-link">Show full recipe</Link>
            </>,
            data._id
		)
    }
    
    createHorizontalMenu = (list) => {
        return list.map(item => {
            return (
                <div className={'menu-item'} key={item._id}>
                    <div className="menu-content">
                        <div className="menu-title">{item.title}</div>
                        <div className="menu-description">{item.description}</div>
                    </div>
                    <Link className="show-full-link small" to={'/articles/' + item._id}>Read more</Link>
                </div>
            );
        });
    }

	render = () => {
        const recipes = this.state.recipes;
        const articles = this.state.articles;
        const isLoadDone = this.state.isLoadDone;

        if (!isLoadDone) {
            return null;
        }

        return (
            <>
                { articles.length > 0 &&
                    <Container>
                        {
                            this.createRow(
                                <ScrollMenu
                                    data={this.createHorizontalMenu(articles)}
                                    arrowLeft={<img src="/images/right-arrow.png" className="arrow-prev" alt=""/>}
                                    arrowRight={<img src="/images/right-arrow.png" className="arrow-next" alt=""/>}
                                    />
                            )
                        }
                    </Container>
                }

                <Container>
                    {
                        recipes.length > 0
                        ?
                            recipes.map(item => this.createRecipeRow(item))
                        :
                            this.createRow(<div className="inner-indent">There is no recipes yet :(</div>)
                    }
                </Container>
            </>
        )
	}
}

const mapStateToProps = ({ recipes, categories, router }) => ({
    recipes,
    categories,
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
)(ItemsPage);
