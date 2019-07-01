import { SET_DASHBOARD_HOURS } from '../actions/types';

export default (state = {start:0,end:24}, action) => {
    switch (action.type) {
        case SET_DASHBOARD_HOURS:
            console.log(action.payload);
            return action.payload;
        default:
            return state;
    }
};