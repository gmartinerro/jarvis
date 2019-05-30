import { combineReducers } from 'redux';
import dashboardDatesReducer from './dashboardDatesReducer';
import dailyProfileReducer from './dailyProfileReducer';
import dailyForecastReducer from './dailyForecastReducer';

export default combineReducers({
    dates: dashboardDatesReducer,
    dailyProfile: dailyProfileReducer,
    ordersForecast: dailyForecastReducer
});
