import React from 'react';
import '../assets/scss/auth.scss';
import AuthForm from "../components/AuthForm";

function Auth() {
  return (
    <div className='auth-page'>
      <img className='auth-img' src={`${process.env.PUBLIC_URL}/img/main.png`} alt='main_photo'/>
      <AuthForm/>
    </div>
  )
}

export default Auth