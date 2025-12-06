import { useState, useEffect } from 'react';
import { useNotificationContext } from '../store/NotificationContext';
import '../styles/components.css';

function NotificationSettings() {
  const { 
    notificationsEnabled, 
    permissionStatus, 
    toggleNotifications, 
    requestPermission,
    scheduledNotifications
  } = useNotificationContext();
  
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (permissionStatus === 'default') {
      // We'll wait for user interaction before requesting
    }
  }, [permissionStatus]);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled && permissionStatus !== 'granted') {
      await requestPermission();
    } else {
      toggleNotifications(!notificationsEnabled);
    }
  };

  return (
    <div className="notification-settings-container">
      <div className="notification-settings-card">
        <div className="notification-header" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="notification-header-content">
            <div className="notification-icon-wrapper">
              <span className="notification-bell-icon">🔔</span>
            </div>
            <div className="notification-title-section">
              <h3 className="notification-main-title">Medication Reminders</h3>
              <p className="notification-subtitle">Stay on track with your medications</p>
            </div>
          </div>
          <button className="expand-toggle-btn" aria-label={isExpanded ? "Collapse" : "Expand"}>
            <svg 
              className={`expand-icon ${isExpanded ? 'expanded' : ''}`} 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
            >
              <path 
                d="M5 7.5L10 12.5L15 7.5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        <div className={`notification-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="notification-status-section">
            <div className="status-display">
              <div className={`status-indicator ${
                permissionStatus === 'granted' ? 'status-granted' : 
                permissionStatus === 'denied' ? 'status-denied' : 
                'status-default'
              }`}>
                <span className="status-icon">
                  {permissionStatus === 'granted' ? '✓' : 
                   permissionStatus === 'denied' ? '✕' : '!'}
                </span>
                <div className="status-text">
                  <span className="status-label">Notification Status</span>
                  <span className="status-value">
                    {permissionStatus === 'granted' ? 'Allowed' : 
                     permissionStatus === 'denied' ? 'Blocked' : 
                     'Not Set'}
                  </span>
                </div>
              </div>
              
              <div className="notification-toggle-wrapper">
                <label className="premium-toggle">
                  <input 
                    type="checkbox" 
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    disabled={permissionStatus === 'denied'}
                    className="toggle-input"
                  />
                  <span className="toggle-track">
                    <span className="toggle-thumb"></span>
                  </span>
                  <span className="toggle-text">
                    {notificationsEnabled ? 'ON' : 'OFF'}
                  </span>
                </label>
              </div>
            </div>
            
            {permissionStatus === 'denied' && (
              <div className="alert-box alert-warning">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <p className="alert-title">Notifications Blocked</p>
                  <p className="alert-text">
                    Please enable notifications in your browser settings to receive medication reminders.
                  </p>
                  <p className="alert-hint">
                    Look for the notification icon 🔔 in your browser's address bar.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {notificationsEnabled && scheduledNotifications.length > 0 && (
            <div className="scheduled-section">
              <div className="section-header">
                <div className="section-icon">📅</div>
                <h4 className="section-title">Scheduled Reminders</h4>
                <span className="reminder-count">{scheduledNotifications.length}</span>
              </div>
              <div className="reminders-grid">
                {scheduledNotifications.map(notification => (
                  <div key={notification.id} className="reminder-item">
                    <div className="reminder-icon">💊</div>
                    <div className="reminder-details">
                      <span className="reminder-medicine">{notification.medicineName}</span>
                      <span className="reminder-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {notificationsEnabled && scheduledNotifications.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p className="empty-state-title">No Reminders Yet</p>
              <p className="empty-state-text">
                Add medicines with scheduled times to receive reminders.
              </p>
            </div>
          )}
          
          <div className="info-section">
            <div className="info-header">
              <div className="info-icon">ℹ️</div>
              <h4 className="info-title">How Reminders Work</h4>
            </div>
            <div className="info-box">
              <div className="info-item">
                <span className="info-bullet">•</span>
                <p className="info-text">
                  Receive notifications at your scheduled medication times
                </p>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <p className="info-text">
                  <strong>Notifications work even when the app is closed</strong>
                </p>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <p className="info-text">
                  Compatible with desktop, tablet, and mobile devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;