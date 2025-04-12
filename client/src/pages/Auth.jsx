import React from 'react'
import AuthForm from '../components/AuthForm'
import { getUser } from '../utils/authentication';
import { Navigate } from 'react-router-dom';

const Auth = () => {

  const user = getUser();

  if(user && user.email) return <Navigate to="/home" replace />;

  return (
    <div>
        <AuthForm />
    </div>
  )
}

export default Auth