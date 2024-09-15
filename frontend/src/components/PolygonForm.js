import React, { useState, useEffect } from 'react';
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
import {LATITUDE, LONGITUDE} from '../referenceData/constants';
import {transformCoordinate} from '../services/coordinate';

function PolygonForm(){
  const [polygonTitle, setPolygonTitle] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [polygon, setPolygon] = useState([]);
  const [totalData, setTotalData] = useState('');
  const [loading, setLoading] = useState(false);
  const [latitudeInvalid, setLatitudeInvalid] = useState(false);
  const [longitudeInvalid, setLongitudeInvalid] = useState(false);
  const [saveDisable, setSaveDisable] = useState(true);

  const toast = useToast();
  const axios = useAxios();

  useEffect(() => {
    setTotalData(`${polygonTitle}:\n${JSON.stringify(polygon)}`)
    setLatitude('')
    setLongitude('')
    setSaveDisable(false)
  }, [polygon])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const data = new FormData()
      data.set('title', polygonTitle)
      data.set('polygon', polygon)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/polygons`, data)
      console.log(response)
      // toast({
      //   description: 'Пользователь успешно зарегистрирован',
      //   status: "success",
      //   duration: 5000,
      //   isClosable: true,
      // });
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

  function addCoordinate() {
    const validate = validateCoordinate()
    if (!validate) return
    const result = transformCoordinate(latitude, longitude)
    setPolygon(prevPolygon => [ ...prevPolygon, result])
  }

  function validateCoordinate() {
    const isValidLatitude = latitude.match(LATITUDE)
    const isValidLongitude = longitude.match(LONGITUDE)
    setLatitudeInvalid(!isValidLatitude)
    setLongitudeInvalid(!isValidLongitude)
    return isValidLatitude && isValidLongitude
  }

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

          <FormControl id="titlePolygon" isRequired>
            <FormLabel>Название</FormLabel>
            <Input
              type="text"
              value={polygonTitle}
              placeholder="Название полигона"
              onChange={(e) => setPolygonTitle(e.target.value)}/>
          </FormControl>

          <FormControl id="latitude" isRequired>
            <FormLabel>Широта</FormLabel>
            <Input
              type="number"
              value={latitude}
              placeholder="Введите широту"
              onChange={(e) => setLatitude(e.target.value)}
              isInvalid={latitudeInvalid}
              errorBorderColor='red.500'/>
          </FormControl>

          <FormControl id="longitude" isRequired>
            <FormLabel>Долгота</FormLabel>
            <Input
                type='number'
                value={longitude}
                placeholder="Введите долготу"
                onChange={(e) => setLongitude(e.target.value)}
                isInvalid={longitudeInvalid}
                errorBorderColor='red.500'/>
          </FormControl>

          <Button colorScheme="blue" type="button" width="full" onClick={addCoordinate}>
            Добавить
          </Button>

          <div className='textarea-block'>
            <Text mb='8px'>Итоговое значение</Text>
            <Textarea
              value={totalData}
              placeholder='Нажмите "Проверить", чтобы посмотреть итоговый результат'
              isReadOnly/>
          </div>

          <Button isLoading={loading} colorScheme="blue" type="submit" width="full" isDisabled={saveDisable}>
            Сохранить
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default PolygonForm