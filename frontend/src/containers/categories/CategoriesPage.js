import React from 'react';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TreeView from './TreeView';
import { Container, Row, Col } from 'reactstrap';

import './style.scss';

class CategoriesPage extends React.Component {
	render = () => {
		const categories = this.props.categories;
		
		return (
			<Container>
				<Row>
					<Col className="content" lg={{ size: 8, offset: 2 }} xs={{ size: 10, offset: 1 }}>
						<TreeView data={categories} />
					</Col>
				</Row>
			</Container>
		)
	}
}

const mapStateToProps = ({ categories, router }) => ({
	categories,
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
)(CategoriesPage);
