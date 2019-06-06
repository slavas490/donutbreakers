import React from 'react';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TreeViewMenu from 'react-simple-tree-menu';
import { ListGroup, ListGroupItem } from 'reactstrap';

const DEFAULT_PADDING = 10;
const ICON_SIZE = 10;
const LEVEL_SPACE = 16;

const ToggleIcon = ({ on, onClick }) => (
    <div style={{ display: 'inline-block' }} onClick={onClick}>
        <span style={{ marginRight: 8, width: ICON_SIZE, display: 'inline-block' }}>{on ? '-' : '+'}</span>
    </div>
);

const ListItem = ({
    level = 0,
    hasNodes,
    isOpen,
    label,
    searchTerm,
    openNodes,
    toggleNode,
    onClick,
    matchSearch,
    ...props
}) => (
    <ListGroupItem
        style={{
            paddingLeft: DEFAULT_PADDING + ICON_SIZE + level * LEVEL_SPACE,
            cursor: 'pointer',
        }}
    >
        {hasNodes && <ToggleIcon on={isOpen} onClick={toggleNode} />}
        <Link to={'/categories/' + props._id} onClick={onClick}>{label}</Link>
    </ListGroupItem>
);

class TreeView extends React.Component {
	render = () => {
		return (
            <TreeViewMenu
                data={this.props.data}
                onClickItem={this.props.onClickItem}
                debounceTime={125}>
                    {({ search, items }) => (
                        <>
                            <ListGroup>
                                {items.map(props => (
                                    <ListItem {...props} />
                                ))}
                            </ListGroup>
                        </>
                    )}
            </TreeViewMenu>
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
)(TreeView);
