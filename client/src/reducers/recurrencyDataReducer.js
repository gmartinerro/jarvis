import { RECURRENCY_DATA } from '../actions/types';
import * as d3 from 'd3';

export default (state = null, action) => {
    switch (action.type) {
        case RECURRENCY_DATA:

            return action.payload.map(item =>
                ({ date: d3.timeParse('%Y-%m-%d')(item[0]),recurrent:parseInt(item[1]), seconds:parseInt(item[2]),visits:parseInt(item[3])})
            )
        default:
            return state;
    }
};
