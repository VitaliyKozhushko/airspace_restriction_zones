import Logout from "../components/Logout";
import React from 'react';
import { Box, Flex, VStack, Button, Link as ChakraLink} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {routes} from '../routes';

function Dashboard() {

  return(
    <Flex h="100vh" flexDirection="column">
        <Flex
          as="header"
          width="100%"
          height="61px"
          p={4}
          bg="blue.500"
          justifyContent="space-between"
          alignItems="center"
        >
          <Logout/>
        </Flex>

        <Flex flex="1">
          <Box
            as="nav"
            width="200px"
            p={4}
            bg="gray.100"
            borderRight="1px solid"
            borderColor="gray.200"
          >
            <VStack align="start" spacing={4}>
              <ChakraLink color='blue.500' as={ReactRouterLink} to={routes.home} fontWeight='500'>
                Главная
              </ChakraLink>
              <ChakraLink color='blue.500' as={ReactRouterLink} to={routes.listPolygon} fontWeight='500'>
                Список полигона
              </ChakraLink>
              <ChakraLink color='blue.500' as={ReactRouterLink} to={routes.createPolygon} fontWeight='500'>
                Создание полигона
              </ChakraLink>
            </VStack>
          </Box>

        </Flex>
      </Flex>
  )
}

export default Dashboard