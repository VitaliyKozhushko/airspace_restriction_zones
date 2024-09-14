import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading
} from '@chakra-ui/react';

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://example.com/api/login', {
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

  return (
    <Box
      className='auth-form'
      maxW="md"
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg">
      <Heading as='h3' size='lg' mb={5}>Вход</Heading>
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
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Войти
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AuthForm;
