import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../features/initSlice';
import '../assets/scss/auth.scss';

function Auth() {
  const value = useSelector((state) => state.initState.value);
  const dispatch = useDispatch();
  console.log(process.env.REACT_APP_API_URL)

  return (
    <div className='auth-page'>
      <img className='auth-img' src={`${process.env.PUBLIC_URL}/img/main.png`} alt='main_photo'></img>
      <h1>{value}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  )
}

export default Auth