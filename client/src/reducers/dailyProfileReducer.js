import { DAILY_ORDERS_PROFILE } from '../actions/types';

export default (state = null, action) => {
    switch (action.type) {
        case DAILY_ORDERS_PROFILE:
            return action.payload;
        default:
            return state;
    }
};