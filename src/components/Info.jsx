import { Box, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BsDiscord, BsSteam } from 'react-icons/bs';
import { Tooltip } from '@chakra-ui/react'

const Info = (props) => {
  const { isMobile, info, contactLinks } = props;

  return (
    <Box as="section" textAlign="center" position="relative" w="100%" mb={'1rem'} mt={{ sm: '1rem', md: '2rem' }} >
      <Box display='flex' flexDir='column' alignItems='center' gap={2}>
        <Box className={isMobile ? 'skin-image-container' : 'scale-image'}>
          {info?.FotoURL && (
            <Image className="shadow-for-skin-image" width={90} height={90} style={{ 'borderRadius': '50%' }} src={info.FotoURL}></Image>
          )}
        </Box>

        <Box display='flex' flexDir='column' alignItems='center' gap='0.5rem'>
          <Text fontWeight="bold" w='100%' fontSize='xl' borderBottom='1px solid #d13535' pb={2}>{info.Nombre}</Text>

          <Text color="grey" fontWeight="normal" fontSize='md'>Puedes contactarme mediante</Text>

          <Box display='flex' gap={3}>

            {contactLinks.map((contact) => (
              <Box key={contact.Nombre} _hover={{ 'transform': 'scale(1.2)', 'msTransformOrigin': '50% 50%' }} transition='transform .4s'>

                {contact.Nombre == 'Steam' && contact.Ocultar == 'FALSE' && (
                  <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='bottom' label="Contáctame por Steam" aria-label="Contáctame por Steam">
                    <Box boxShadow='md' _hover={{ 'transform': isMobile ? '' : 'scale(1.05)', 'msTransformOrigin': '50% 50%' }} transition='transform .4s'>
                      <Link href="https://steamcommunity.com/id/FireWolf__CSGO" rel="noopener noreferrer" target="_blank">
                        <BsSteam fontSize='1.5rem' />
                      </Link>
                    </Box>
                  </Tooltip>
                )}

                {contact.Nombre == 'Discord' && contact.Ocultar == 'FALSE' && (
                  <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='bottom' label="Contáctame por Discord" aria-label="Contáctame por Discord">
                    <Box boxShadow='md' _hover={{ 'transform': isMobile ? '' : 'scale(1.05)', 'msTransformOrigin': '50% 50%' }} transition='transform .4s'>
                      <Link href="https://steamcommunity.com/id/FireWolf__CSGO" rel="noopener noreferrer" target="_blank">
                        <BsDiscord fontSize='1.5rem' />
                      </Link>
                    </Box>
                  </Tooltip>
                )}

              </Box>
            ))}

          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Info