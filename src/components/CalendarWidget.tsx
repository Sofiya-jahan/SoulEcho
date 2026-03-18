import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DiaryEntry } from '../services/entryService';
import './CalendarWidget.css';

interface CalendarWidgetProps {
  entries: DiaryEntry[];
  onDateChange: (date: Date) => void;
  selectedDate: Date;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ entries, onDateChange, selectedDate }) => {
  const entryDates = entries.map(e => e.date);

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (entryDates.includes(dateStr)) {
        return 'has-entry';
      }
    }
    return null;
  };

  return (
    <div className="calendar-container bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-black/5">
      <Calendar
        onChange={(val) => onDateChange(val as Date)}
        value={selectedDate}
        tileClassName={tileClassName}
        className="soul-echo-calendar"
        next2Label={null}
        prev2Label={null}
      />
    </div>
  );
};

export default CalendarWidget;
