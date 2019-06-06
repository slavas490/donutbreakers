export const SET_CATEGORIES = 'categories/SET_CATEGORIES';

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_CATEGORIES:
			return [
				...state,
				...action.data
			]

		default:
			return state
	}
};

export const setCategories = (data) => {
	return dispatch => {
		dispatch({
			type: SET_CATEGORIES,
			data
		});
	}
};
