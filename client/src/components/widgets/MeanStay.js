import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BigTime} from '../BigNumbers';


class MeanStay extends Component {

    render() {

        const field = (this.props.type === 'total') ? 'seconds' : 'seconds_rec'

        if (this.props.offlineData){
            return <BigTime seconds={this.props.offlineData[field]} units='seg.'></BigTime>
        }else{
            return <BigTime seconds='0'></BigTime>
        }
    }

  }

  const mapStateToProps = (state)=>{
      return {offlineData: state.offlineData, onlineData:state.onlineData}
  }

export default connect(mapStateToProps)(MeanStay);