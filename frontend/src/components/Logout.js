import { useNavigate } from "react-router-dom";
import {Button} from '@chakra-ui/react';
import React from "react";
import '../assets/scss/personalAccount.scss'

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <Button className="logout-btn" onClick={handleLogout}>
      <img className='logout-img' src={`${process.env.PUBLIC_URL}/img/exit.png`} alt='exit_button'></img>
    </Button>
  );
};

export default Logout;
