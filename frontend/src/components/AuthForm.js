import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Text,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useAxios from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setLogin] = useState(true);
  const [showPasswd, setShowPasswd] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const axios = useAxios();

  const titleForm = isLogin ? 'Вход' : 'Регистрация'
  const titleBtnDesicion = isLogin ? 'Регистрация' : 'Войти'
  const titleBtnAuth = isLogin ? 'Войти' : 'Зарегистрироваться'
  const descriptionDesicion = isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт'
  const authUrl = isLogin ? '/login' : '/registration'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const data = new FormData()
      data.set('username', username)
      data.set('password', password)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}${authUrl}`, data)
      if (isLogin) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        navigate('/personal_account')
        return
      }
      toast({
        description: 'Пользователь успешно зарегистрирован',
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setLogin(true)
    } catch (error) {
      const commonErr = isLogin
        ? 'Не получилось проверить логин и пароль. Попробуйте позже'
        : 'Не удалось зарегистрироваться. Попробуйте позже'
      const errMes = !error?.response?.data
        ? commonErr
        : error.response.data.message[0]
      toast({
        title: "Ошибка",
        description: errMes,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false)
    }
  };

  const changeDesicion = () => {
    setUsername('')
    setPassword('')
    setLogin(!isLogin)
  };

  return (
    <Box
      className='auth-form'
      maxW="md"
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg">
      <Heading as='h3' size='lg' mb={5}>{titleForm}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>

          <FormControl id="username" isRequired>
            <FormLabel>Логин</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Пароль</FormLabel>
            <InputGroup>
              <Input
                type={showPasswd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={() => setShowPasswd(!showPasswd)}>
                  {showPasswd ? <ViewOffIcon/> : <ViewIcon/>}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button isLoading={loading} colorScheme="blue" type="submit" width="full">
            {titleBtnAuth}
          </Button>
        </VStack>
      </form>
      <div className='change-decision'>
        <Text fontSize='xs'>{descriptionDesicion}</Text>
        <Button colorScheme='messenger' variant='link' onClick={changeDesicion}>
          {titleBtnDesicion}
        </Button>
      </div>
    </Box>
  );
};

export default AuthForm;
