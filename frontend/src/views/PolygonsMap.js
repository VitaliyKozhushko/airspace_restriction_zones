import React, { useEffect, useState } from 'react'
import useAxios from "../services/axiosInstance";
import {useToast} from "@chakra-ui/react";

function PolygonsMap(){
  const [mapHtml, setMapHtml] = useState('');

  const toast = useToast();
  const axios = useAxios();

  useEffect(() => {
    getMap()
  }, [])

  async function getMap() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/map/`)
      setMapHtml(response.data.map)
      toast({
        description: 'Карта загружена',
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: 'Не удалось загрузить карту. Попробуйте позже',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
    }
  }

  return (
    <div className='polygon-map-block'>
      <div dangerouslySetInnerHTML={{__html: mapHtml}}/>
    </div>
  )
}

export default PolygonsMap