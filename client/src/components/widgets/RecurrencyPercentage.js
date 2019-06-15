import React, {Component} from 'react';
import {connect} from 'react-redux';
import BigNumber from '../BigNumbers';


class RecurrencyPercentage extends Component {

    render() {

        const field = (this.props.type === 'online') ? 'onlineData': 'offlineData'

        if (this.props[field]){
            return <BigNumber number={this.props[field].recurrency} units='%'></BigNumber>
        }else{
            return <BigNumber number='0'></BigNumber>
        }
    }

  }

  const mapStateToProps = (state)=>{
      return {offlineData: state.offlineData, onlineData: state.onlineData}
  }

export default connect(mapStateToProps)(RecurrencyPercentage);