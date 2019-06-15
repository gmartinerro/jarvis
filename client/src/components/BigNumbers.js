
import React from 'react';
import './BigNumbers.scss';

const BigNumber = ({number, decimals, units}) => {

  const BIGNUMBER_DECIMALS = 2;

  decimals = (decimals) || BIGNUMBER_DECIMALS;
  const intPart = parseInt(number);
  const decimalPart = Math.round((number - intPart) * 10**(decimals));
  
  if (Number.isNaN(intPart) || Number.isNaN(decimalPart)){
    return (<div className="BigNumber">
              ---
            </div>)
  }
  else{
    return(
      
      <div className="BigNumber">
        {intPart}<span className="bignumber-decimal">.{decimalPart}</span><span className="bignumber-units">{units}</span>
      </div>
    )
  }
}

const BigInt = ({number, units}) => {

  const intPart = parseInt(number);

  return(
      <div className="BigNumber">
        {intPart}<span className="bignumber-units">{units}</span>
      </div>
    )
}

const BigTrends = ({percent}) => {

  const intPart = Math.abs(Math.round(percent));
  const style = (percent >= 0) ? ((percent > 0) ? 'positive' : 'zero') : 'negative';

  return(
      <div className={`BigTrends bigtrends-${style}`}>
        {intPart}<span className='bigtrends-units'>%</span>
      </div>
    )
}

const BigTime = ({seconds}) => {

  const hours = parseInt(seconds / 3600);
  const minutes = parseInt((seconds % 3600)/60)
  
  return(
      <div className="BigTime">
        {hours}<span className='bigtime-units'>h</span>
        {minutes}<span className='bigtime-units'>m</span>
      </div>
    )
}




export default BigNumber;
export { BigNumber, BigInt, BigTrends, BigTime};

