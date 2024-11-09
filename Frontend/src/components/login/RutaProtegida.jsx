import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  // Verificar si hay un usuario autenticado
  const isAuthenticated = localStorage.getItem('auth');

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default RutaProtegida;
