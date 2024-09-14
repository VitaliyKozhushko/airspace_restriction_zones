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

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setLogin] = useState(true);
  const [showPasswd, setShowPasswd] = useState(false)

  const toast = useToast();

  const titleForm = isLogin ? 'Вход' : 'Регистрация'
  const titleBtnDesicion = isLogin ? 'Регистрация' : 'Войти'
  const titleBtnAuth = isLogin ? 'Войти' : 'Зарегистрироваться'
  const descriptionDesicion = isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт'
  const authUrl = isLogin ? 'login' : 'registration'

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://example.com/api/${authUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при авторизации');
      }

      const data = await response.json();

    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Неверный логин или пароль",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error('Ошибка авторизации:', error);
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

          <Button colorScheme="blue" type="submit" width="full">
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
