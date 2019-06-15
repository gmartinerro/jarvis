import React from 'react';
import './Grid.scss';

import RecurrencyPercentage from '../components/widgets/RecurrencyPercentage';
import MeanStay from '../components/widgets/MeanStay';
import AverageOrder from '../components/widgets/AverageOrder';
import CustomerList  from '../components/widgets/CustomerList';

const CustomersPage = props => {

  return (
    <div className="Grid">

      <h3>OFFLINE</h3>
      <div className='grid-row half'>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>RECURRENCIA</div>
            <RecurrencyPercentage type='offline'></RecurrencyPercentage>
          </div>
        </div>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>ESTANCIA MEDIA (recurrentes)</div>
            <MeanStay type='recurrent'></MeanStay>
          </div>
        </div>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>ESTANCIA MEDIA (nuevos)</div>
            <MeanStay type='total'></MeanStay>
          </div>
        </div>
      </div>
      <h3>ONLINE</h3>
      <div className='grid-row half'>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>RECURRENCIA</div>
            <RecurrencyPercentage type='online'></RecurrencyPercentage>
          </div>
        </div>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>TICKET MEDIO (recurrentes)</div>
            <AverageOrder type='recurrent'></AverageOrder>
          </div>
        </div>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>TICKET MEDIO (nuevos)</div>
            <AverageOrder type='total'></AverageOrder>
          </div>
        </div>
      </div>

      <div className="grid-row">
        <div className="grid-cell-12">
          <div className="widget">
            <div className='widget-title'>LISTA DE CLIENTES ONLINE</div>
            <CustomerList></CustomerList>
          </div>
        </div>
      </div>

      {/* <div className='container'>
        <header class='head'>HEADER</header>
        <div class='title'>
            <h1>TITLE</h1>
        </div>
        <main class='main-content'>
        <ForecastLineChart id='mainForecast' height='200'></ForecastLineChart>
        </main>
        <aside class='sidebar'>SID</aside>
        <footer class='footer'>FOOTER</footer>
    </div> */}
    </div>
  );
};

export default CustomersPage;
