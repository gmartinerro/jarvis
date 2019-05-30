import React, {Component} from 'react';
import {connect} from 'react-redux';
import BigNumber from '../BigNumbers';

class TicketsPerDay extends Component {

    render() {
        if (this.props.dailyProfile){
            console.log(this.props.dailyProfile.total)
            return <BigNumber number={this.props.dailyProfile.total}></BigNumber>
        }else{
            return <BigNumber number='0'></BigNumber>
        }
    }

  }

  const mapStateToProps = (state)=>{
      return {dailyProfile: state.dailyProfile}
  }

export default connect(mapStateToProps)(TicketsPerDay);