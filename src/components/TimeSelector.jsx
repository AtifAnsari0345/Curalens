import { useState, useEffect } from 'react';

function TimeSelector({ selectedTimes = [], onChange }) {
  const [times, setTimes] = useState(selectedTimes);
  const [newTime, setNewTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (onChange) {
      onChange(times);
    }
  }, [times, onChange]);

  const addTime = () => {
    if (!newTime) {
      setError('Please select a time');
      return;
    }

    // Check if time already exists
    if (times.includes(newTime)) {
      setError('This time is already added');
      return;
    }

    setTimes([...times, newTime]);
    setNewTime('');
    setError('');
  };

  const removeTime = (timeToRemove) => {
    setTimes(times.filter(time => time !== timeToRemove));
  };

  // Format time for display (12-hour format with AM/PM)
  const formatTimeForDisplay = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  return (
    <div className="time-selector-container">
      <div className="time-input-container">
        <input
          type="time"
          className="time-input"
          value={newTime}
          onChange={(e) => {
            setNewTime(e.target.value);
            setError('');
          }}
          aria-label="Select medication time"
        />
        <button 
          type="button" 
          className="add-time-btn"
          onClick={addTime}
          aria-label="Add time"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Add
        </button>
      </div>
      
      {error && <p className="time-error">{error}</p>}
      
      {times.length > 0 && (
        <div className="selected-times">
          <ul className="time-chips">
            {times.map((time, index) => (
              <li key={index} className="time-chip">
                <span>{formatTimeForDisplay(time)}</span>
                <button 
                  type="button" 
                  className="remove-time-btn"
                  onClick={() => removeTime(time)}
                  aria-label={`Remove ${formatTimeForDisplay(time)}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TimeSelector;