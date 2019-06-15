import React, {Component} from 'react';
import {connect} from 'react-redux';
import BigNumber from '../BigNumbers';

class AverageOrder extends Component {

    render() {
        const field = (this.props.type === 'total') ? 'avg_ticket' : 'avg_ticket_rec'

        if (this.props.onlineData){
            return <BigNumber number={this.props.onlineData[field]} units='€'></BigNumber>
        }else{
            return <BigNumber number='0'></BigNumber>
        }
    }

  }

  const mapStateToProps = (state)=>{
      return {onlineData: state.onlineData}
  }

export default connect(mapStateToProps)(AverageOrder);