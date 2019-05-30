import { SET_DASHBOARD_DATES } from '../actions/types';

export default (state = null, action) => {
    switch (action.type) {
        case SET_DASHBOARD_DATES:
            return action.payload;
        default:
            return state;
    }
};