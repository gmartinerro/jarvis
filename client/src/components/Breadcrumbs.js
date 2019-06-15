import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Breadcrumbs.scss';
import {Link} from 'react-router-dom';
import { setCurrentDates } from '../actions';

const PAGES = {'/':'Dashboard','/customers':'Clientes'}


class Breadcrumbs extends Component {
  state = { start: '2018-09-21', end: '2019-04-30' };

  componentDidMount() {
    this.props.setCurrentDates(this.state);
  }

  // addOneMonth(month) {
  //   let date = new Date(month);
  //   date.setMonth(date.getMonth() + 1);
  //   return date.toISOString().split('T')[0];
  // }

  handleStartChange(event) {
    this.setState({ start: event.target.value, end: this.state.end });
    console.log('STATE:', this.state);
    console.log('START:', event.target.value);
    this.props.setCurrentDates({ start: event.target.value, end: this.state.end });
  }

  handleEndChange(event) {
    this.setState({ start: this.state.start, end: event.target.value });
    console.log('STATE:', this.state);
    console.log('END:', event.target.value);
    this.props.setCurrentDates({ start: this.state.start, end: event.target.value });
  }

  render() {
    console.log('BCR', this.props);

    return (
      <div className="Breadcrumbs">
        <ul className="breadcrumb-items">
          <li><Link to='/'>Batavia</Link></li>
          <li className='last'>{PAGES[this.props.location.pathname]}</li>
        </ul>
        <form>
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
  { setCurrentDates }
)(Breadcrumbs);
