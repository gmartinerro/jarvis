import React, {Component} from 'react';
import {connect} from 'react-redux';
import BigNumber from '../BigNumbers';

class AverageTicketNumber extends Component {

    render() {
        if (this.props.dailyProfile){
            return <BigNumber number={this.props.dailyProfile.average} units='€'></BigNumber>
        }else{
            return <BigNumber number='0'></BigNumber>
        }
    }

  }

  const mapStateToProps = (state)=>{
      return {dailyProfile: state.dailyProfile}
  }

export default connect(mapStateToProps)(AverageTicketNumber);