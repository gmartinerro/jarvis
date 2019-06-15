import { combineReducers } from 'redux';
import dashboardDatesReducer from './dashboardDatesReducer';
import dailyProfileReducer from './dailyProfileReducer';
import dailyForecastReducer from './dailyForecastReducer';
import offlineDataReducer from './offlineDataReducer';
import onlineDataReducer from './onlineDataReducer';
import recurrencyDataReducer from './recurrencyDataReducer';
import rfmReducer from './rfmReducer';
import dailyPatternReducer from './dailyPatternReducer';

export default combineReducers({
    dates: dashboardDatesReducer,
    dailyProfile: dailyProfileReducer,
    ordersForecast: dailyForecastReducer,
    offlineData: offlineDataReducer,
    onlineData: onlineDataReducer,
    dailyRecurrency: recurrencyDataReducer,
    customerList: rfmReducer,
    dailyPattern: dailyPatternReducer
});
