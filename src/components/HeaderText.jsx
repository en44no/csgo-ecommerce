import { Box, Text } from "@chakra-ui/react";

const HeaderText = () => {
  return (
    <Box display='flex' flexDir={{ sm: 'column', md: 'row', lg: 'row' }} justifyContent='center' mt='1.5rem' fontWeight="semibold">
      <Box display='flex' alignItems='center'>
        <Text as="h1" lineHeight="normal" fontWeight="bold" mt="-2" mr='0.5rem' fontSize={{ sm: '3xl', md: '5xl', lg: '6xl' }} >
          ¡Cambia tus
        </Text>
        <Text as="h1" fontWeight="800" lineHeight="normal" bgGradient="linear(to-r, red.500, red.600, red.500)" bgClip="text" mt="-2" mr='0.5rem' fontSize={{ sm: '4xl', md: '5xl', lg: '6xl' }} >
          Cajas
        </Text>
      </Box>
      <Box display='flex' justifyContent='flex-end' alignItems='center'>
        <Text as="h1" lineHeight="normal" fontWeight="bold" mt="-2" mr='0.5rem' fontSize={{ sm: '3xl', md: '5xl', lg: '6xl' }} >
          por
        </Text>
        <Text as="h1" fontWeight="800" lineHeight="normal" bgGradient="linear(to-r, red.500, red.600, red.500)" bgClip="text" mt="-2" fontSize={{ sm: '4xl', md: '5xl', lg: '6xl' }} >
          Skins
        </Text>
        <Text as="h1" lineHeight="normal" fontWeight="bold" mt="-2" fontSize={{ sm: '4xl', md: '5xl', lg: '6xl' }} >
          !
        </Text>
      </Box>
    </Box>
  )
}

export default HeaderText