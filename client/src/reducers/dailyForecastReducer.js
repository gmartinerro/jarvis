import { DAILY_ORDERS_FORECAST } from '../actions/types';

export default (state = null, action) => {
    switch (action.type) {
        case DAILY_ORDERS_FORECAST:
            return action.payload;
        default:
            return state;
    }
};