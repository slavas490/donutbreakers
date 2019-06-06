import { combineReducers } from 'redux';
import categories from './categories';
import breadcrumbs from './breadcrumbs';

export default combineReducers({
	categories,
	breadcrumbs
});
