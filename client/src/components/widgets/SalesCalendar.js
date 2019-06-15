import React, {Component} from 'react';
import './SalesCalendar.scss';
import {connect} from 'react-redux';
import { getDailyProfile } from '../../actions'

class SalesCalendar extends Component {

    state = {selection: null};
    heatmap = null;

    componentDidMount(){
    }

    componentDidUpdate(){
    }

    setupHeatmap(){
        this.heatmap = [{},{},{},{},{},{},{}]
        let minWeek= 104, maxWeek=1;
                
        let outlierKeys = Object.create(null);
        for (let outlier of this.props.dailyPattern.stats.outliers){
            
            if (!outlierKeys[outlier[0]])
                outlierKeys[outlier[0]] = [outlier[1]]
            else
                outlierKeys[outlier[0]].push(outlier[1]);
        }

        for (const row of this.props.dailyPattern.heatmap){
            if (minWeek > row.week)
                minWeek = row.week;
            if (maxWeek < row.week)
                maxWeek = row.week;

            if(outlierKeys[row.date]){
                row.outlier = outlierKeys[row.date];
            }

            this.heatmap[row.wday][row.week] = row;
        }

        for (let day of this.heatmap){
            if (!day[minWeek]){
                day[minWeek] = null;
            }
            if (!day[maxWeek]){
                day[maxWeek] = null;
            }
        }
    }

    renderMonths(){
        const monthNames = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

        let offset = 0;
        let mon = null;
        
        if (!this.heatmap)
            return '';

        // Get the second month, to avoid overlapping at the start (it mey not be room enough to place the label)
        for(let i in this.heatmap[0]){
            const day = this.heatmap[0][i]; 
            if (mon == null && day!=null)
                mon = day.mon;
            if (mon != null && day !=null && day.mon !== mon){
                mon = day.mon
                break;
            }
            offset++;
        }
        
        mon = null;
        let months = []
        const weeksArray = Object.values(this.heatmap[0]);
        for (let i=offset; i < weeksArray.length; i++){
            const day = weeksArray[i];
            if (day.mon !== mon){
                mon = day.mon;
                months.push({month:monthNames[(mon-1)%12], offset: i});
            }
        }

        return (
        <div className={`sales-calendar-months-row`}>
            {this.renderMonthNames(months)}
        </div>
        )
    }

    renderMonthNames(months){
        return months.map((mon)=>{
            return (<div className={`sales-calendar-month offset-${mon.offset}`} key={mon.month}>{mon.month}</div>)
        })
        
    }

    renderHeatmap(){
        let key = 0;
        let weekDays = ['L','M','X','J','V','S','D'];

        if (!this.heatmap)
            return null;

        return this.heatmap.map((row,i)=>{
            key ++;
            return <div className='sales-calendar-row' key={'wday' + key}><div className='sales-calendar-row-wday'>{weekDays[i]}</div>{this.renderHeatmapRow(row)}</div>
        });
    }

    renderHeatmapRow(row){
        let key = 1000;
        return Object.values(row).map((cell)=>{
            key++;
            if (cell){
                const selected = (cell.date === this.state.selection) ? 'selected' : ''
                const outlier = (cell.outlier) ? 'outlier' : '';
                return (<div className={`sales-calendar-cell level-${cell.quintile} ${selected} ${outlier}`} key={key} onClick={(e)=>this.selectDay(e,cell)}></div>)
            }
            else
                return <div className='sales-calendar-cell empty-cell' key={key}></div>
        })        

    }

    render() {

      if (!this.props.dailyPattern)
        return null;
        
      this.setupHeatmap();

      return (
        <div className="SalesCalendar">
            {this.renderMonths()}
            <div className='sales-calendar-heatmap'>
                {this.renderHeatmap()}
            </div>
            <div className='sales-calendar-legend'>
                <span className='sales-calendar-legend-label'>MENOR</span>
                <div className='cell level-0'>&nbsp;</div>
                <div className='cell level-1'>&nbsp;</div>
                <div className='cell level-2'>&nbsp;</div>
                <div className='cell level-3'>&nbsp;</div>
                <div className='cell level-4'>&nbsp;</div>
                <span className='sales-calendar-legend-label'>MAYOR</span>
            </div>
        </div>
      );
    }

    selectDay(e,cell){
        console.log(cell);
        const date = new Date(cell.date);
        date.setDate(date.getDate() + 1);
        this.props.getDailyProfile(cell.date, date.toISOString().substr(0,10))
        this.setState({...this.state,selection:cell.date});
    }
  }

  const mapStateToProps = (state)=>{
      return {dailyPattern: state.dailyPattern}
  }

export default connect(mapStateToProps,{getDailyProfile})(SalesCalendar);