export const ADD_BREADCRUMBS = 'breadcrumbs/ADD_BREADCRUMBS';
export const REMOVE_BREADCRUMBS = 'breadcrumbs/REMOVE_BREADCRUMBS';

const initialState = [
	{
		link: '/',
		title: 'Home'
	}
];

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_BREADCRUMBS:
			return [
				...state,
				{
					link: action.data.link,
					title: action.data.title
				}
			]

		case REMOVE_BREADCRUMBS:
			return state.filter(item => item.title !== action.data)

		default:
			return state
	}
}

export const addBreadcrumbs = (title, route) => {
	const link = route;

	return dispatch => {
		dispatch({
			type: ADD_BREADCRUMBS,
			data: {
				title,
				link
			}
		});
	}
}

export const removeBreadcrumbs = (data) => {
	return dispatch => {
		dispatch({
			type: REMOVE_BREADCRUMBS,
			data
		});
	}
}