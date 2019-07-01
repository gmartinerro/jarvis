import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Breadcrumbs.scss';
import {Link} from 'react-router-dom';
import { setCurrentDates, setCurrentHours } from '../actions';


const PAGES = {'/':'Dashboard','/customers':'Clientes'}


class Breadcrumbs extends Component {
  state = { start: '2018-09-21', end: '2019-04-30', wday: 7, hstart:0, hend:23 };

  componentDidMount() {
    this.props.setCurrentDates(this.state);
  }

  // addOneMonth(month) {
  //   let date = new Date(month);
  //   date.setMonth(date.getMonth() + 1);
  //   return date.toISOString().split('T')[0];
  // }

  handleStartChange(event) {
    this.setState({ start: event.target.value, end: this.state.end, wday: this.state.wday, hstart:this.state.hstart,hend: this.state.hend });
    this.props.setCurrentDates({ start: event.target.value, end: this.state.end, wday:7, hstart:this.state.hstart,hend: this.state.hend });
  }

  handleEndChange(event) {
    this.setState({ start: this.state.start, end: event.target.value, wday: this.state.wday, hstart:this.state.hstart,hend: this.state.hend });
    this.props.setCurrentDates({ start: this.state.start, end: event.target.value , wday:7, hstart:this.state.hstart,hend: this.state.hend});
  }

  handleWdayChange(event) {
    this.setState({ start: this.state.start,end: this.state.end, wday: event.target.value, hstart:this.state.hstart,hend: this.state.hend});
    this.props.setCurrentDates({ start: this.state.start, end: this.state.end, wday: event.target.value, hstart:this.state.hstart,hend: this.state.hend});
  }

  handleHstartChange(event) {
    this.setState({ start: this.state.start,end: this.state.end, wday: this.state.wday, hstart:event.target.value, hend: this.state.hend});
    this.props.setCurrentHours({ start: parseInt(event.target.value), end: parseInt(this.state.hend)});
  }

  handleHendChange(event) {
    this.setState({ start: this.state.start,end: this.state.end, wday: this.state.wday, hend:event.target.value, hstart: this.state.hstart});
    this.props.setCurrentHours({ start: parseInt(this.state.hstart), end: parseInt(event.target.value)});
  }


  renderHoursAsOptions(){
    let hours = new Array(24).fill(0).map((d,i)=><option value={i} key={i}>{i}</option>);
    return hours;
  }

  render() {
    return (
      <div className="Breadcrumbs">
        <ul className="breadcrumb-items">
          <li><Link to='/'>Batavia</Link></li>
          <li className='last'>{PAGES[this.props.location.pathname]}</li>
        </ul>
        <form>
          <select className="select-css" value={this.state.hstart} onChange={event => this.handleHstartChange(event)}>
            {this.renderHoursAsOptions()}
          </select>
          <select className="select-css" value={this.state.hend} onChange={event => this.handleHendChange(event)}>
            {this.renderHoursAsOptions()}
          </select>
          <select className="select-css" value={this.state.wday} onChange={event => this.handleWdayChange(event)}>
            <option value="7">TODOS</option>
            <option value="0">L</option>
            <option value="1">M</option>
            <option value="2">X</option>
            <option value="3">J</option>
            <option value="4">V</option>
            <option value="5">S</option>
            <option value="6">D</option>
          </select>
          <select className="select-css" value={this.state.start} onChange={event => this.handleStartChange(event)}>
            <option value="2018-09-21">INICIO</option>
            <option value="2018-10-01">OCT 2018</option>
            <option value="2018-11-01">NOV 2018</option>
            <option value="2018-12-01">DIC 2018</option>
            <option value="2019-01-01">ENE 2019</option>
            <option value="2019-02-01">FEB 2019</option>
            <option value="2019-03-01">MAR 2019</option>
          </select>
          <select className="select-css" value={this.state.end} onChange={event => this.handleEndChange(event)}>
            <option value="2018-10-01">OCT 2018</option>
            <option value="2018-11-01">NOV 2018</option>
            <option value="2018-12-01">DIC 2018</option>
            <option value="2019-01-01">ENE 2019</option>
            <option value="2019-02-01">FEB 2019</option>
            <option value="2019-03-01">MAR 2019</option>
            <option value="2019-04-01">ABR 2019</option>
            <option value="2019-04-30">FIN</option>
          </select>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { dates: state.dates };
};

export default connect(
  mapStateToProps,
  { setCurrentDates, setCurrentHours }
)(Breadcrumbs);
