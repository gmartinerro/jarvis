import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BigInt} from '../BigNumbers';

class GlobalTicketNumber extends Component {

    render() {
        if (this.props.dailyProfile){
            return <BigInt number={this.props.dailyProfile.global}></BigInt>
        }else{
            return <BigInt number='0'></BigInt>
        }
    }

  }

  const mapStateToProps = (state)=>{
      return {dailyProfile: state.dailyProfile}
  }

export default connect(mapStateToProps)(GlobalTicketNumber);