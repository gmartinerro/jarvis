import { DAILY_ORDERS_PATTERN } from '../actions/types';

export default (state = null, action) => {

    const fillMissingPatterns = (patterns)=>{

        const start = new Date(patterns[0].date);
        const end = new Date(patterns[patterns.length - 1].date);
    
        let today = start;

        let dates = Object.create(null);
        for(let row of patterns){
            dates[row.date] = row;
        }

        let week = patterns[0].week;
        let wday = patterns[0].wday;
        while (today < end){
            const todayStr = today.toISOString().substr(0,10);
            
            if (!dates[todayStr]){
                dates[todayStr] = {date:todayStr,orders:0,wday:wday,mon:today.getMonth()+1,week:week};
            }else{
                dates[todayStr].wday = wday;
            }

            today.setDate(today.getDate() + 1);
            wday = (wday + 1) % 7;
            if (wday === 0)
                week ++;
        }

        return Object.values(dates);
    }

    const getQuintiles = (patterns)=>{
        let orders = patterns.map(row=>row.orders);
        orders.sort((a,b)=>a-b);

        let quintiles = [];
        const len = orders.length;
        
        for(let i=1; i<=5; i++){
            quintiles[i-1] = orders[Math.round(len*i/5)-1];
        }

        orders = patterns.map(row=>{
            row.quintile = getQuintile(row.orders,quintiles);
            return row;
        })

        orders.sort((a,b)=>((a.date > b.date) ? 1 :-1));
        return orders;
    }

    const getQuintile = (orders, quintiles)=>{
        if (orders <= quintiles[2]){
            if (orders <= quintiles[1])
                return (orders <= quintiles[0]) ? 0 : 1;
            else
                return 2;
        }else{
            return (orders <= quintiles[3]) ? 3 : 4;
        }
    }

    switch (action.type) {
        case DAILY_ORDERS_PATTERN:

            if (!action.payload)
                return null;

            return {'heatmap':getQuintiles(fillMissingPatterns(action.payload.heatmap)),
                    'stats': action.payload.stats};

        default:
            return state;
    }  
};