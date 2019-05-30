import api from '../api'
import {SET_DASHBOARD_DATES, DAILY_ORDERS_PROFILE, DAILY_ORDERS_FORECAST} from './types'

/**
 * Sets the date range to show info in dashboard pages
 * @param {*} dates The range of dates as a javascript object with start and end fields (i.e. {start:'2018-09-21',end:'2018-10-01'})
 */
export const setCurrentDates = dates =>  (dispatch, getState) => {
    dispatch({type:SET_DASHBOARD_DATES,payload:dates});
    dispatch(getDailyProfile(dates.start, dates.end));
    //dispatch(getForecast(dates.start, dates.end));
};


export const getDailyProfile = (start,end) => async (dispatch, getState) => {
    const response = await api.get(`/dayprofile/${start}/${end}`);
    let profile = response.data;    
    dispatch({ type: DAILY_ORDERS_PROFILE, payload: profile });
};


export const getForecast = (start,end) => async (dispatch, getState) => {
    const response = await api.get(`/forecast/${start}/${end}`);
    let profile = response.data;    
    dispatch({ type: DAILY_ORDERS_FORECAST, payload: profile });
};
