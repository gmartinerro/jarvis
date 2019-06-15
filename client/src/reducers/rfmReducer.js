import { RFM_DATA } from '../actions/types';


export default (state = null, action) => {
    switch (action.type) {
        case RFM_DATA:
            return action.payload;
        default:
            return state;
    }
};
