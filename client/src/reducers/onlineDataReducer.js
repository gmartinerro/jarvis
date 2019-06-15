import { ONLINE_DATA } from '../actions/types';

export default (state = null, action) => {
    switch (action.type) {
        case ONLINE_DATA:
            if (!action.payload)
                return {visits:null,avg_ticket:null,recurrency:null, avg_ticket_rec:null};
    
            const data = action.payload.online;
    
            const result = data.reduce((result,item)=>{
                result[0] ++;
                
                if (item[1] > 1){
                    result[2]++;
                    result[3]+=parseInt(item[2]);
                }else{
                    result[1] += parseInt(item[2]);
                }            
                return result;
            },[0,0,0,0])
    
            result[1]/=result[0] - result[2];
            result[3]/=result[2];
            return {visits:result[0],avg_ticket:parseInt(result[1]),recurrency:result[2]*100/result[0], avg_ticket_rec:parseInt(result[3])};

        default:
            return state;
    }
};