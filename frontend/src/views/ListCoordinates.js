import React, {useState, useEffect} from 'react';
import useAxios from "../services/axiosInstance";
import {CheckCircleIcon, CloseIcon} from "@chakra-ui/icons";
import { Spinner } from '@chakra-ui/react';
import {
  Alert,
  AlertIcon,
  Stack
} from '@chakra-ui/react'

function ListCoordinates(){
  const [listCoordinates, setListCoordinates] = useState([])
  const [loading, setLoading] = useState(false)

  const axios = useAxios();


  async function getData() {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/polygons/`)
      console.log(response.data)
      setListCoordinates(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className='list-coordinates-table'>
      {!loading
        ? (listCoordinates.length ? (<div className='custom-table'>
            <div className='custom-table-header'>
              <div className='table-field id-field'>№ п/п</div>
              <div className='table-field title-field'>Полигон</div>
              <div className='table-field coord-field'>Координаты</div>
              <div className='table-field intersection-field'>Пересечение</div>
              <div className='table-field update-field'>Дата обновления</div>
            </div>
            <div className='custom-table-body'>
              {listCoordinates.map((item, index) => (
                <div
                  key={index}
                  className={['custom-table-str', item.id % 2 === 0 ? 'blue-str' : ''].join(' ')}>
                  <div className='table-field id-field'>{item.id}</div>
                  <div className='table-field title-field'>{item.title}</div>
                  <div className='table-field coord-field'>
                    {JSON.stringify(item.polygon.coordinates[0])}
                  </div>
                  <div className='table-field intersection-field'>{item.intersection_antimeridian
                    ? <CheckCircleIcon color='green'/>
                    : <CloseIcon color='red'/>}</div>
                  <div className='table-field update-field'>{new Date(item.updated_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>)
            : <Stack>
              <Alert status='info'>
                <AlertIcon />
                  Созданных полигонов нет.
                </Alert>
              </Stack>
        )
        : <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
          }
    </div>
  );
}

export default ListCoordinates

