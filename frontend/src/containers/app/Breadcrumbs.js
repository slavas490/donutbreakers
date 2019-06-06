import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';

class Breadcrubms extends React.Component {
	render = () => {
        const data = this.props.breadcrumbs;

		return (
			<Container>
                <Row>
                    <Col className="content" lg={{ size: 8, offset: 2 }} xs={{ size: 10, offset: 1 }}>
                        <ul className="breadcrumbs">
                            { data.map(item =>
                                <li key={item.link}>
                                    <Link to={item.link}>{item.title}</Link>
                                </li>)
                            }
                        </ul>
                    </Col>
                </Row>
			</Container>
		)
	}
}

const mapStateToProps = ({ breadcrumbs, router }) => ({
    breadcrumbs,
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
)(Breadcrubms);
