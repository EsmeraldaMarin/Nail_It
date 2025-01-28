import React, { useState } from 'react';
import axios from 'axios';

const DeleteAccount = () => {
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:5050/clientes/{id}');
      setMessage('Account deleted successfully');
    } catch (error) {
      setMessage('Error deleting account');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Delete Account</h3>
      <button onClick={handleDelete}>Delete Account</button>
      <p>{message}</p>
    </div>
  );
};

export default DeleteAccount;
