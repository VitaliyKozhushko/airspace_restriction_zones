import React, {useState, useEffect} from 'react';
import useAxios from "../services/axiosInstance";
import {CheckCircleIcon, CloseIcon, EditIcon, DeleteIcon, CheckIcon} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Stack,
  IconButton,
  Spinner,
  Input, Textarea,
  useToast,
} from '@chakra-ui/react'
import {arrToGeoJSON} from "../services/coordinate";

function ListCoordinates() {
  const [listCoordinates, setListCoordinates] = useState([])
  const [loading, setLoading] = useState(false)
  const [strLoading, setStrLoading] = useState('')
  const [editStr, setEditStr] = useState('')
  const [changeData, setChangeData] = useState({})

  const toast = useToast();
  const axios = useAxios();

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/polygons/`)
      setListCoordinates(response.data)
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: 'Не получилось загрузить список координат. Попробуййте позже',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setChangeData({ ...changeData, [key]: value });
  };

  const handleEditStr = (item) => {
    setEditStr(item.id)
    let editData = {
      title: item.title,
      polygon: item.polygon.coordinates[0]
    }
    setChangeData({ ...changeData, ...editData });
  };

  const handleCancelStr = () => {
    setEditStr('')
    setChangeData({})
  };

  const saveEditStr = async () => {
    try {
      setStrLoading(editStr)
      const changeDataList = Object.entries(changeData);
      const data = new FormData()
      changeDataList.forEach(([key, value]) => {
        if (key === 'polygon') {
          data.set(key, arrToGeoJSON(value))
        } else {
         data.set(key, value)
        }
      });
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/polygons/${editStr}/`, data)
      setListCoordinates(listCoordinates =>
        listCoordinates.map(item =>
          item.id === +editStr ? { ...item, ...response.data } : item
        )
      );
      toast({
        description: 'Полигон успешно обновлен',
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      handleCancelStr()
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: 'Не получилось обновить полигон. Попробуйте позже',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setStrLoading('')
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/polygons/${id}/`)
      setListCoordinates(listCoordinates => listCoordinates.filter(item => item.id !== id));
      toast({
        description: 'Полигон удален',
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: 'Не получилось удалить полигон. Попробуйте позже',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
    }
    handleCancelStr()
  };

  function transformCoords(coords, intersectionsArr) {
    if (!intersectionsArr.length) {
      return (
        <div className='table-field coord-field'>
          {JSON.stringify(coords)}
        </div>
      )
    }
    return (
      <div className='table-field coord-field'>[
        {
          coords.map((coord, index) => {
              const isIntersection = intersectionsArr.includes(index)
              if (isIntersection) {
                return (<span key={index} className='intersection-coord'>
                  {`[${coord}]`}
                </span>)
              } else {
                return `[${coord}]`
              }
            }
          )
        }
      ]</div>
    )
  }

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
                <div className='table-field action-field'>Действия</div>
              </div>
              <div className='custom-table-body'>
                {listCoordinates.map((item, index) => (
                  <div
                    key={index}
                    className={['custom-table-str', item.id % 2 === 0 ? 'blue-str' : ''].join(' ')}>
                    <div className='table-field id-field'>{index+1}</div>
                    {strLoading === item.id
                      ? <Spinner
                          thickness='4px'
                          speed='0.65s'
                          emptyColor='gray.200'
                          color='blue.500'
                          size='sm'
                        />
                      : editStr === item.id
                          ? <div className='table-field title-field'>
                            <Input
                              value={changeData.title}
                              onInput={(e) => handleChange('title', e.target.value)}
                              size='sm'
                            />
                          </div>
                          : <div className='table-field title-field'>{item.title}</div>}
                    {editStr === item.id
                      ? <div className='table-field coord-field'>
                        <Textarea
                          value={JSON.stringify(changeData.polygon)}
                          onInput={(e) => handleChange('polygon', JSON.parse(e.target.value))}
                          size='sm'
                        />
                      </div>
                      : transformCoords(item.polygon.coordinates[0], item.antimeridian_coordinates)}
                    <div className='table-field intersection-field'>{item.intersection_antimeridian
                      ? <CheckCircleIcon color='green'/>
                      : <CloseIcon color='red'/>}</div>
                    <div className='table-field update-field'>{new Date(item.updated_at).toLocaleString()}</div>
                    <div className='table-field action-field'>
                      {!editStr && (<div className='actions-block'><IconButton
                        colorScheme='blue'
                        aria-label='edit polygon'
                        size='sm'
                        icon={<EditIcon/>}
                        onClick={() => handleEditStr(item)}/>
                        <IconButton
                        colorScheme='red'
                        aria-label='remove polygon'
                        size='sm'
                        icon={<DeleteIcon />}
                        onClick={() => handleRemove(item.id)}/>
                      </div>)
                    }
                      {editStr && (<div className='actions-block'>
                        <IconButton
                          colorScheme='green'
                          aria-label='confirm edit polygon'
                          size='sm'
                          icon={<CheckIcon/>}
                          onClick={saveEditStr}/>
                        <IconButton
                          colorScheme='red'
                          aria-label='cancel edit polygon'
                          size='sm'
                          icon={<CloseIcon />}
                          onClick={handleCancelStr}/>
                      </div>)
                    }
                    </div>
                  </div>
                ))}
              </div>
            </div>)
            : <Stack>
              <Alert status='info'>
                <AlertIcon/>
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

