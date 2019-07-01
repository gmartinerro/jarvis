import React from 'react';
import './Grid.scss';
import DailyProfileChart from '../components/widgets/DailyProfileChart';
import VerticalCalendar from '../components/widgets/VerticalCalendar';
// import TicketsPerDayNumber from '../components/widgets/TicketsPerDayNumber';
// import AverageTicketNumber from '../components/widgets/AverageTicketNumber';
// import GlobalTicketNumber from '../components/widgets/GlobalTicketNumber';


const ProfilePage = props => {

  return (
    <div className="Grid">
      <div className="grid-row">
        <div className="grid-cell-2">
          <div className="widget">
            <div className='widget-title'>PERFIL SEMANAL</div>
            <VerticalCalendar></VerticalCalendar>
          </div>
        </div>
        <div className="grid-cell-10">
          <div className="widget">
            <div className='widget-title'>PERFIL DIARIO</div>
            <DailyProfileChart id='dailyProfile' height='340'></DailyProfileChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
