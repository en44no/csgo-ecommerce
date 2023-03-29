import React from 'react';
import { Divider, Flex, Text } from '@chakra-ui/react';

const PageLayoutHeader = (props) => {
  const { title } = props;

  return (
    <>
      <Flex align="center" w='100%'>
        <Divider bg='#dee5f0' h='0.07rem' />
        <Text padding='3' textAlign='center' minW='fit-content' fontSize='3xl' fontWeight='bold'>{title}</Text>
        <Divider bg='#dee5f0' h='0.07rem' />
      </Flex>
    </>
  );
};

export default PageLayoutHeader;
