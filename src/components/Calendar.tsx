// src/components/Calendar.tsx
import { useState, useEffect } from 'react';
import { query } from '../db/client';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const loadEvents = async () => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const result = await query(`
      SELECT symbol, event_date 
      FROM events 
      WHERE event_date LIKE '${monthStr}%'
    `);
    setEvents((result as any[]) || []);
  };

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  // Padding for start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>{monthNames[month]} {year}</h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
        {days.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="calendar-day empty"></div>;
          
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter(e => e[1] === dateStr);

          return (
            <div key={day} className="calendar-day">
              <span className="day-number">{day}</span>
              <div className="event-dots">
                {dayEvents.map((e, i) => (
                  <span key={i} className="dot" title={e[0]}></span>
                ))}
              </div>
              {dayEvents.length > 0 && (
                <div className="event-labels">
                  {dayEvents.map((e, i) => (
                    <span key={i} className="event-label">{e[0].split('.')[0]}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
