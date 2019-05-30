import React, {Component} from 'react';
import './SalesCalendar.scss';
import {connect} from 'react-redux';
import { getDailyProfile } from '../../actions'
import HEATMAP from './heatmap.json'



class SalesCalendar extends Component {

    state = {selection: null, heatmap:null};

    componentDidMount(){        
        let heatmap = [{},{},{},{},{},{},{}]
        let minWeek= 104, maxWeek=1;
        
        for (const i in HEATMAP){
            const row = HEATMAP[i]
            if (minWeek > row.week)
                minWeek = row.week;
            if (maxWeek < row.week)
                maxWeek = row.week;

            heatmap[row.wday][row.week] = row
        }

        for (let wday in heatmap){
            if (!heatmap[wday][minWeek]){
                heatmap[wday][minWeek] = null;
            }
            if (!heatmap[wday][maxWeek]){
                heatmap[wday][maxWeek] = null;
            }
        }

        this.setState({selection: null, heatmap:heatmap, dates: null});
    }


    componentDidUpdate(){
        console.log("CDU");
        
        if (this.state.dates !== this.props.dates)
            this.setState({...this.state,selection:null, dates:this.props.dates});
    }

    renderMonths(){
        const monthNames = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

        let offset = 0;
        let offsets = [];
        let mon = null;
        
        if (!this.state.heatmap)
            return '';

        // Get the second month, to avoid overlapping at the start (it mey not be room enough to place the label)
        for(let i in this.state.heatmap[0]){
            const day = this.state.heatmap[0][i]; 
            if (mon == null && day!=null)
                mon = day.mon;
            if (mon != null && day !=null && day.mon > mon){
                mon = day.mon
                break;
            }
            offset++;
        }
        
        mon = null;
        let months = []
        const weeksArray = Object.values(this.state.heatmap[0]);
        for (let i=offset; i < weeksArray.length; i++){
            const day = weeksArray[i];
            if (day.mon !== mon){
                mon = day.mon;
                months.push({month:monthNames[(mon-1)%12], offset: i});
            }
        }

        console.log(offsets);

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

        if (!this.state.heatmap)
            return null;

        return this.state.heatmap.map((row,i)=>{
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
                return (<div className={`sales-calendar-cell level-${cell.level}  ${selected}`} key={key} onClick={(e)=>this.selectDay(e,cell)}></div>)
            }
            else
                return <div className='sales-calendar-cell empty-cell' key={key}></div>
        })        

    }

    render() {
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
        const date = new Date(cell.date);
        date.setDate(date.getDate() + 1);
        this.props.getDailyProfile(cell.date, date.toISOString().split('T')[0])
        this.setState({...this.state,selection:cell.date});
    }
  }

  const mapStateToProps = (state)=>{
      return {dates: state.dates}
  }

export default connect(mapStateToProps,{getDailyProfile})(SalesCalendar);