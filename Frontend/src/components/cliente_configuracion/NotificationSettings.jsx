import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5050/clientes/notifications');
        setNotificationsEnabled(response.data.notificationsEnabled);
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      }
    };
    fetchNotificationSettings();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5050/clientes/notifications', { notificationsEnabled });
      setMessage('Notification settings updated successfully');
    } catch (error) {
      setMessage('Error updating settings');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Notification Settings</h3>
      <label>
        Enable Notifications:
        <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
      </label>
      <button onClick={handleUpdate}>Update Settings</button>
      <p>{message}</p>
    </div>
  );
};

export default NotificationSettings;
