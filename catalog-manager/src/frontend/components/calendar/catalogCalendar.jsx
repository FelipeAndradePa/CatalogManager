import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import './catalogCalendar.css';

const CatalogCalendar = ({alterationDates}) => {

    const tileClassName = ({ date, view }) => {
        // Adiciona uma classe aos dias que tiveram alterações
        if (view === 'month') {
          const isAltered = alterationDates.some(alterationDate =>
            alterationDate.getFullYear() === date.getFullYear() &&
            alterationDate.getMonth() === date.getMonth() &&
            alterationDate.getDate() === date.getDate()
          );
          return isAltered ? 'altered-day' : null;
        }
      };

      return (
        <div>
          <Calendar
            tileClassName={tileClassName}
          />
        </div>
      );
}

export default CatalogCalendar;