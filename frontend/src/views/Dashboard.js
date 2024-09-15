import Logout from "../components/Logout";
import React from 'react';
import { Box, Flex, VStack, Button} from '@chakra-ui/react';

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
              <Button colorScheme='messenger' variant='link'>
                Главная
              </Button>
              <Button colorScheme='messenger' variant='link'>
                Создание полигона
              </Button>
              <Button colorScheme='messenger' variant='link'>
                Список полигона
              </Button>
            </VStack>
          </Box>

        </Flex>
      </Flex>
  )
}

export default Dashboard