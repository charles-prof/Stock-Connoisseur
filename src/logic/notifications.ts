// src/logic/notifications.ts
import { getEvents, updateEvent } from '../db/client';

export const checkNotifications = async () => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const allEvents = getEvents();

  // Check for today's reports
  const todayReports = allEvents.filter(e => e.event_date === today && e.notified < 2);

  if (todayReports.length > 0) {
    todayReports.forEach(report => {
      new Notification('Reporting Today!', {
        body: `${report.symbol.split('.')[0]} is reporting earnings today.`,
        icon: '/favicon.svg'
      });
      updateEvent(report.symbol, report.event_date); // Note: updateEvent needs to handle notification status too or we adapt logic
    });
  }

  // Check for tomorrow's reports
  const tomorrowReports = allEvents.filter(e => e.event_date === tomorrow && e.notified < 1);

  if (tomorrowReports.length > 0) {
    tomorrowReports.forEach(report => {
      new Notification('Reporting Tomorrow', {
        body: `${report.symbol.split('.')[0]} is reporting earnings tomorrow.`,
        icon: '/favicon.svg'
      });
      updateEvent(report.symbol, report.event_date);
    });
  }
};
