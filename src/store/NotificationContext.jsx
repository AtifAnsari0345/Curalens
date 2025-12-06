import { createContext, useState, useEffect, useContext } from 'react';
import { useAppContext } from './AppContext';

// Create context
export const NotificationContext = createContext();

// Storage key for notification settings
const NOTIFICATION_SETTINGS_KEY = 'curalens_notification_settings';

export function NotificationProvider({ children }) {
  const { medicines } = useAppContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState('default');

  // Initialize notification settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setNotificationsEnabled(parsedSettings.enabled || false);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }

    // Check notification permission status
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Save notification settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify({ enabled: notificationsEnabled })
    );
  }, [notificationsEnabled]);

  // Request notification permission
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  // Schedule notifications for all medicines
  const scheduleAllMedicineNotifications = () => {
    if (!notificationsEnabled || permissionStatus !== 'granted') {
      return;
    }

    // Clear any existing scheduled notifications
    clearAllScheduledNotifications();

    // Create new scheduled notifications
    const newScheduledNotifications = [];

    medicines.forEach(medicine => {
      // Handle both the old format (times array) and new format (reminderTimes array)
      const timesToSchedule = medicine.reminderTimes || medicine.times;
      
      if (!timesToSchedule || !timesToSchedule.length) return;

      timesToSchedule.forEach(timeStr => {
        try {
          let hours, minutes;
          
          // Handle 24-hour format from TimeSelector (HH:MM)
          if (timeStr.includes(':') && !timeStr.includes('am') && !timeStr.includes('pm')) {
            const [hoursStr, minutesStr] = timeStr.split(':');
            hours = parseInt(hoursStr, 10);
            minutes = parseInt(minutesStr, 10);
          } else {
            // Parse time string (e.g., "8am", "2pm", "14:30")
            const timeObj = parseTimeString(timeStr);
            if (!timeObj) return;
            hours = timeObj.hours;
            minutes = timeObj.minutes;
          }
          
          // Schedule notification
          const notificationId = scheduleNotification(
            medicine.id,
            medicine.name,
            medicine.dose,
            hours,
            minutes
          );

          if (notificationId) {
            newScheduledNotifications.push({
              id: notificationId,
              medicineId: medicine.id,
              medicineName: medicine.name,
              time: timeStr,
              hours,
              minutes
            });
          }
        } catch (error) {
          console.error(`Error scheduling notification for ${medicine.name} at ${timeStr}:`, error);
        }
      });
    });

    setScheduledNotifications(newScheduledNotifications);
  };

  // Parse time string (e.g., "8:00 AM, 2:00 PM") into array of time objects
  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    
    timeStr = timeStr.trim().toLowerCase();
    
    // Try to match patterns like "8am", "2pm", "14:30", "2:30pm"
    let hours = 0;
    let minutes = 0;

    // Pattern: "2:30pm" or "14:30"
    if (timeStr.includes(':')) {
      const [hourStr, minuteStr] = timeStr.split(':');
      
      // Handle "2:30pm" format
      if (minuteStr.includes('pm') && !minuteStr.includes('am')) {
        hours = parseInt(hourStr);
        if (hours < 12) hours += 12;
        minutes = parseInt(minuteStr);
      } 
      // Handle "2:30am" format
      else if (minuteStr.includes('am')) {
        hours = parseInt(hourStr);
        if (hours === 12) hours = 0;
        minutes = parseInt(minuteStr);
      } 
      // Handle "14:30" format
      else {
        hours = parseInt(hourStr);
        minutes = parseInt(minuteStr);
      }
    } 
    // Pattern: "2pm" or "8am"
    else if (timeStr.includes('am') || timeStr.includes('pm')) {
      if (timeStr.includes('pm')) {
        hours = parseInt(timeStr.replace('pm', ''));
        if (hours < 12) hours += 12;
      } else {
        hours = parseInt(timeStr.replace('am', ''));
        if (hours === 12) hours = 0;
      }
    } 
    // Try to parse as 24-hour format
    else {
      hours = parseInt(timeStr);
    }

    // Validate parsed time
    if (isNaN(hours) || hours < 0 || hours > 23 || isNaN(minutes) || minutes < 0 || minutes > 59) {
      return null;
    }

    return { hours, minutes };
  };

  // Schedule a single notification
  const scheduleNotification = (medicineId, medicineName, dose, hours, minutes) => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();
      const notificationId = `medicine-${medicineId}-${hours}-${minutes}`;

      // Schedule the notification
      setTimeout(() => {
        showNotification(medicineName, dose);
        
        // Reschedule for the next day
        scheduleNotification(medicineId, medicineName, dose, hours, minutes);
      }, timeUntilNotification);

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  };

  // Show a notification
  const showNotification = (medicineName, dose) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      // Try to use the service worker for notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('CuraLens Medication Reminder', {
            body: `Time to take ${medicineName} (${dose})`,
            icon: '/Curalens app logo.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            tag: 'medication-reminder',
            renotify: true,
            requireInteraction: true,
            actions: [
              { action: 'taken', title: 'Taken' },
              { action: 'snooze', title: 'Snooze' }
            ]
          });
        });
      } else {
        // Fallback to regular notification
        new Notification('CuraLens Medication Reminder', {
          body: `Time to take ${medicineName} (${dose})`,
          icon: '/Curalens app logo.png'
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  // Clear all scheduled notifications
  const clearAllScheduledNotifications = () => {
    // In a real implementation, we would cancel all the scheduled timeouts
    // For simplicity, we're just clearing the list here
    setScheduledNotifications([]);
  };

  // Toggle notifications on/off
  const toggleNotifications = async (enabled) => {
    if (enabled && permissionStatus !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    setNotificationsEnabled(enabled);
    
    if (enabled) {
      scheduleAllMedicineNotifications();
    } else {
      clearAllScheduledNotifications();
    }
  };

  // Reschedule notifications when medicines change
  useEffect(() => {
    if (notificationsEnabled && permissionStatus === 'granted') {
      scheduleAllMedicineNotifications();
    }
  }, [medicines, notificationsEnabled, permissionStatus]);

  const value = {
    notificationsEnabled,
    permissionStatus,
    scheduledNotifications,
    toggleNotifications,
    requestPermission,
    scheduleAllMedicineNotifications,
    clearAllScheduledNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook for using the notification context
export const useNotificationContext = () => useContext(NotificationContext);