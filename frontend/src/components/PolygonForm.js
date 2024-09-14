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
  Textarea,
  Text
} from '@chakra-ui/react';
import useAxios from "../services/axiosInstance";

function PolygonForm(){
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [polygon, setPolygon] = useState('');

  const toast = useToast();
  const axios = useAxios();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const data = new FormData()
      data.set('latitude', latitude)
      data.set('longitude', longitude)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/save`, data)
      toast({
        description: 'Пользователь успешно зарегистрирован',
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      const commonErr = 'Не получить сохранить полигон. Попробуйте позже'
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

  return (
    <Box
      className='polygon-form'
      w='100%'
      maxW="md"
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg">
      <Heading as='h3' size='lg' mb={5}>Полигон</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>

          <FormControl id="latitude" isRequired>
            <FormLabel>Широта</FormLabel>
            <Input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Введите широту"
            />
          </FormControl>

          <FormControl id="longitude" isRequired>
            <FormLabel>Долгота</FormLabel>
            <Input
                type='text'
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Введите долготу"
              />
          </FormControl>

          <div className='textarea-block'>
            <Text mb='8px'>Итоговое значение</Text>
            <Textarea
              value={polygon}
              placeholder='Нажмите "Проверить", чтобы посмотреть итоговый результат'
            />
          </div>

          <Button isLoading={loading} colorScheme="blue" type="submit" width="full">
            Сохранить
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default PolygonForm