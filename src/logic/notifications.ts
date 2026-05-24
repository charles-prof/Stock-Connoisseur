// src/logic/notifications.ts
import { query } from '../db/client';

export const checkNotifications = async () => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Check for today's reports
  const todayReports = await query(`
    SELECT symbol FROM events 
    WHERE event_date = '${today}' AND notified < 2
  `);

  if (todayReports && (todayReports as any[]).length > 0) {
    (todayReports as any[]).forEach(report => {
      new Notification('Reporting Today!', {
        body: `${report[0].split('.')[0]} is reporting earnings today.`,
        icon: '/favicon.svg'
      });
    });
    // Mark as fully notified (level 2)
    await query(`UPDATE events SET notified = 2 WHERE event_date = '${today}'`);
  }

  // Check for tomorrow's reports
  const tomorrowReports = await query(`
    SELECT symbol FROM events 
    WHERE event_date = '${tomorrow}' AND notified < 1
  `);

  if (tomorrowReports && (tomorrowReports as any[]).length > 0) {
    (tomorrowReports as any[]).forEach(report => {
      new Notification('Reporting Tomorrow', {
        body: `${report[0].split('.')[0]} is reporting earnings tomorrow.`,
        icon: '/favicon.svg'
      });
    });
    // Mark as notified for 1-day warning (level 1)
    await query(`UPDATE events SET notified = 1 WHERE event_date = '${tomorrow}'`);
  }
};
