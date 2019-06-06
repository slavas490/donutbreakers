import React from 'react';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Api from '../../helpers/api';
import ReactMarkdown from 'react-markdown';
import { Container, Row, Col } from 'reactstrap';
import { addBreadcrumbs, removeBreadcrumbs } from '../../modules/breadcrumbs';

class ArticlePage extends React.Component {
	constructor (props) {
        super(props);
        
        this.state = {
            article: {}
        };
    }
    
    componentWillUnmount () {
        const breadcrumbs = this.state.breadcrumbs;

        for(let i in breadcrumbs) {
            this.props.removeBreadcrumbs(breadcrumbs[i].title);
        }
	}

	componentDidMount = () => {
        const id = this.props.match.params.id;
        let breadcrumbs = [];

        const pushBreadcrumbs = (item) => {
            if (item) {
                if (item.parent) {
                    pushBreadcrumbs(item.parent);
                }

                breadcrumbs.push(item);
            }
        };

		Api.get('/articles/' + id)
		.then(article => {
            let data = article.value;

            pushBreadcrumbs(data.category);

            for(let i in breadcrumbs) {
                let item = breadcrumbs[i];
                this.props.addBreadcrumbs(item.title, '/categories/' + item._id);
            }
            
            breadcrumbs.push(data);
            this.props.addBreadcrumbs(data.title, '/articles/' + data._id);

			this.setState({
                article: data,
                breadcrumbs
            });
        })
        .catch(error => {
            let { history } = this.props;
            
            history.push({
                pathname: '/'
            });
        });
	}

	render = () => {
        const data = this.state.article;

		return (
			<Container>
                <Row className="full">
                    <Col className="content" lg={{ size: 8, offset: 2 }} xs={{ size: 10, offset: 1 }}>
                        <div className="title">{data.title}</div>
                        <div className="text">
                            <ReactMarkdown source={data.text} />
                        </div>
                    </Col>
                </Row>
            </Container>
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
)(ArticlePage);
