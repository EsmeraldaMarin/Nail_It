import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5050/clientes/password', {
        currentPassword,
        newPassword,
      });
      setMessage('Password changed successfully');
    } catch (error) {
      setMessage('Error changing password');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Change Password</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Current Password:</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div>
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit">Change Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ChangePassword;
