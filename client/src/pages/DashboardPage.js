import React from 'react';
import './Grid.scss';
import JarvisIcon from '../jarvis.png';
import ForecastLineChart from '../components/widgets/ForecastLineChart';
import DailyProfileChart from '../components/widgets/DailyProfileChart';
import SalesCalendar from '../components/widgets/SalesCalendar';
import TicketsPerDayNumber from '../components/widgets/TicketsPerDayNumber';
import AverageTicketNumber from '../components/widgets/AverageTicketNumber';
import GlobalTicketNumber from '../components/widgets/GlobalTicketNumber';


const DashboardPage = props => {

  return (
    <div className="Grid">
      <div className="grid-row">
        <div className="grid-cell-12">
          <div className="widget">
            <div className='widget-title'>HISTÓRICO DE VENTAS/PREVISIÓN</div>
            <ForecastLineChart id='mainForecast' height='200'></ForecastLineChart>
          </div>
        </div>
        <div className="grid-cell-3">
          <div className="widget">
            <div className='widget-title'>FACTORES MÁS INFLUYENTES</div>
            <img className='jarvis-icon' src={JarvisIcon} alt='jarvis says...'/>
            <p>¿Sabías que los factores que más influyen en tus ventas son el <b>tráfico de peatones</b>, <b>el día de la semana</b>, y en menor grado <b>el clima</b>?</p>
          </div>
        </div>
      </div>

      <div className="grid-row half">
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>TICKET MEDIO</div>
            <AverageTicketNumber></AverageTicketNumber>
          </div>

        </div>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>TOTAL TICKETS</div>
            <GlobalTicketNumber></GlobalTicketNumber>
          </div>
        </div>
        <div className="grid-cell-4">
          <div className="widget">
            <div className='widget-title'>TICKETS/día</div>
            <TicketsPerDayNumber></TicketsPerDayNumber>            
          </div>
        </div>
      </div>

      <div className="grid-row">
        <div className="grid-cell-6">
          <div className="widget">
            <div className='widget-title'>PERFIL SEMANAL</div>
            <SalesCalendar></SalesCalendar>
          </div>
        </div>
        <div className="grid-cell-6">
          <div className="widget">
            <div className='widget-title'>PERFIL DIARIO</div>
            <DailyProfileChart id='dailyProfile' height='140'></DailyProfileChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
