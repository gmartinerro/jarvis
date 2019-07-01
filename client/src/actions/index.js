import api from '../api'
import {SET_DASHBOARD_DATES, DAILY_ORDERS_PROFILE, DAILY_ORDERS_FORECAST,OFFLINE_DATA, ONLINE_DATA, RECURRENCY_DATA, RFM_DATA,DAILY_ORDERS_PATTERN,SET_DASHBOARD_HOURS} from './types'

/**
 * Sets the date range to show info in dashboard pages
 * @param {*} dates The range of dates as a javascript object with start and end fields (i.e. {start:'2018-09-21',end:'2018-10-01'})
 */
export const setCurrentDates = dates =>  (dispatch, getState) => {
    dispatch({type:SET_DASHBOARD_DATES,payload:dates});
    dispatch(getDailyProfile(dates.start, dates.end));
    dispatch(getOfflineData(dates.start,dates.end));
    dispatch(getOnlineData(dates.start,dates.end));
    dispatch(getRecurrencyData(dates.start,dates.end));
    dispatch(getCustomerList(0));
    dispatch(getDailyPattern(dates.start,dates.end, dates.wday));
    //dispatch(getForecast(dates.start, dates.end));
};

export const setCurrentHours = hours => async (dispatch, getState) => {
    dispatch({ type: SET_DASHBOARD_HOURS, payload: hours });
};

export const getDailyProfile = (start,end) => async (dispatch, getState) => {
    const response = await api.get(`/dayprofile/${start}/${end}`);
    let payload = response.data;    
    dispatch({ type: DAILY_ORDERS_PROFILE, payload: payload });
};

export const getDailyPattern = (start,end, wday) => async (dispatch, getState) => {
    let response;

    if (wday == 7)
        response = await api.get(`/daystats/${start}/${end}`);
    else
        response = await api.get(`/daystats/${start}/${end}/${wday}`);
    
    let payload = response.data;    
    dispatch({ type: DAILY_ORDERS_PATTERN, payload: payload });
};

export const getForecast = (start,end) => async (dispatch, getState) => {
    const response = await api.get(`/forecast/${start}/${end}`);
    let payload = response.data;    
    dispatch({ type: DAILY_ORDERS_FORECAST, payload: payload });
};

export const getOfflineData = (start,end) => async (dispatch, getState) => {
    const response = await api.get(`/customers/offline/${start}/${end}`);
    let payload = response.data;    
    dispatch({ type: OFFLINE_DATA, payload: payload });
};

export const getOnlineData = (start,end) => async (dispatch, getState) => {
    const response = await api.get(`/customers/online/${start}/${end}`);
    let payload = response.data;
    dispatch({ type: ONLINE_DATA, payload: payload });
};


export const getRecurrencyData = (start,end) => async (dispatch, getState) => {
    const response = await api.get(`/customers/recurrency/${start}/${end}`);
    let payload = response.data;
    dispatch({ type: RECURRENCY_DATA, payload: payload });
};


export const getCustomerList = (page) => async (dispatch, getState) => {
    const response = await api.get(`/customers/rfm`);
    let payload = response.data;
    dispatch({ type: RFM_DATA, payload: payload });
};
