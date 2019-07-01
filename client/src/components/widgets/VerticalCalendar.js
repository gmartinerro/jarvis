import React, { Component } from 'react';
import './VerticalCalendar.scss';
import { connect } from 'react-redux';
import { getDailyProfile } from '../../actions';

class VerticalCalendar extends Component {
  state = { selection: null };
  heatmap = null;

  componentDidMount() {}

  componentDidUpdate() {
      console.log("JAR");
  }

  setupHeatmap() {
    this.heatmap = [];

    let outliers = this.getHourlyOutliers();
    let weekIndex = 0;

    for (const row of this.props.dailyPattern.heatmap) {
      if (outliers[row.date]) {
        row.outlier = outliers[row.date];
      }

      if (!this.heatmap[weekIndex]) this.heatmap[weekIndex] = new Array(7).fill(null);

      this.heatmap[weekIndex][row.wday] = row;

      if (row.wday === 6) weekIndex++;
    }
  }

  getOutliers() {
    let outliers = Object.create(null);

    const days = this.props.dailyPattern.heatmap.filter(item => item.wday !== 40);

    let orders = days.map(item => item.orders);
    orders.sort((a, b) => a - b);
    const len = orders.length;

    const median = orders[parseInt(len * 0.5) - 1];
    const q75 = orders[parseInt(len * 0.75) - 1];
    const q25 = orders[parseInt(len * 0.25) - 1];

    const outlier = median + 1.5 * (q75 - q25);

    for (let row of days) {
      if (row.orders >= outlier) outliers[row.date] = [row.orders];
    }

    return outliers;
  }

  getHourlyOutliers() {
    let outliers = Object.create(null);

    for (let outlier of this.props.dailyPattern.stats.outliers) {
      if (outlier[1] >= this.props.hours.start 
       && outlier[1] <= this.props.hours.end) {
        if (!outliers[outlier[0]]) 
          outliers[outlier[0]] = [outlier[1]];
        else 
          outliers[outlier[0]].push(outlier[1]);
      }
    }

    console.log(this.props.hours, outliers);

    const days = this.props.dailyPattern.heatmap.filter(item => item.wday !== 40);

    for (let row of days) {        
      if (outliers[row.date]) {
        row.outlier = outliers[row.date];
      }else{
        row.outlier = null;
      }
    }

    return outliers;
  }

  renderHeatmap() {
    if (!this.heatmap) return null;

    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    let mon = 0;
    let key = 0;
    return this.heatmap.map((row, i) => {
      const rowMon = row.reduce((prev, current) => {
        return current !== null && current.mon !== prev.mon ? current.mon : prev;
      }, mon);

      let monthText = '';
      if (rowMon !== mon) {
        monthText = monthNames[rowMon - 1];
        mon = rowMon;
      }
      key++;
      return (
        <div className="sales-calendar-row" key={'week' + key}>
          <div className="sales-calendar-month">{monthText}</div>
          {this.renderHeatmapRow(row)}
        </div>
      );
    });
  }

  renderHeatmapRow(row) {
    let key = 10000;

    return Object.values(row).map(cell => {
      key++;

      if (cell) {
        const selected = cell.date === this.state.selection ? 'selected' : '';
        const outlier = cell.outlier ? 'outlier' : '';
        return (
          <div
            className={`sales-calendar-cell level-${cell.quintile} ${selected} ${outlier}`}
            key={key}
            onClick={e => this.selectDay(e, cell)}
          />
        );
      } else return <div className="sales-calendar-cell empty-cell" key={key} />;
    });
  }

  renderWeekdays() {
    let weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    return weekDays.map(d => {
      return (
        <div className="sales-calendar-wday" key={d}>
          {d}
        </div>
      );
    });
  }

  render() {
    if (!this.props.dailyPattern) return null;

    this.setupHeatmap();

    return (
      <div className="VerticalCalendar">
        <div className="sales-calendar-row-wday">{this.renderWeekdays()}</div>
        <div className="sales-calendar-heatmap">{this.renderHeatmap()}</div>
        <div className="sales-calendar-legend">
          <span className="sales-calendar-legend-label">0%</span>
          <div className="cell level-0">&nbsp;</div>
          <div className="cell level-1">&nbsp;</div>
          <div className="cell level-2">&nbsp;</div>
          <div className="cell level-3">&nbsp;</div>
          <div className="cell level-4">&nbsp;</div>
          <span className="sales-calendar-legend-label">100%</span>
        </div>
        <div className="sales-calendar-legend">
          <span className="sales-calendar-legend-label">0%</span>
          <div className="cell level-0 outlier">&nbsp;</div>
          <div className="cell level-1 outlier">&nbsp;</div>
          <div className="cell level-2 outlier">&nbsp;</div>
          <div className="cell level-3 outlier">&nbsp;</div>
          <div className="cell level-4 outlier">&nbsp;</div>
          <span className="sales-calendar-legend-label">100%</span>
        </div>
      </div>
    );
  }

  selectDay(e, cell) {
    const date = new Date(cell.date);
    date.setDate(date.getDate() + 1);
    this.props.getDailyProfile(cell.date, date.toISOString().substr(0, 10));
    this.setState({ ...this.state, selection: cell.date });
  }
}

const mapStateToProps = state => {
  return { dailyPattern: state.dailyPattern, hours: state.hours };
};

export default connect(
  mapStateToProps,
  { getDailyProfile }
)(VerticalCalendar);
