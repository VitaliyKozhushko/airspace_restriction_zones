import React, {useEffect} from 'react'
import useAxios from "../services/axiosInstance";

function ListCoordinates(){
  const axios = useAxios();

  async function getData() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/polygons/`)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return(
    <div>
      List
    </div>
  )
}

export default ListCoordinates

