import { Box, Button, Container, Divider, SkeletonCircle, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api from "./api/api";
import { HiLockClosed } from 'react-icons/hi';
import { BsDiscord, BsSteam } from 'react-icons/bs';
import { TiArrowSortedDown } from 'react-icons/ti';
import { TbNumbers } from 'react-icons/tb';
import { Skeleton } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

export default function Home() {

  const [skins, setSkins] = useState([]);
  const [selectedSkin, setSelectedSkin] = useState({});
  const [contactLinks, setContactLinks] = useState([]);
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState([]);
  const [skinsAreLoading, setSkinsAreLoading] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setLoading(true);
    setSkinsAreLoading(true);


    fetchData();
  }, []);

  const fetchData = async () => {
    setSkins(await api.skins.get());

    setSkinsAreLoading(false);

    setContactLinks(await api.contact.get());
    setInfo(await api.info.get());
    setLoading(false);
  };

  function onOpenModal(skin) {
    setSelectedSkin(skin);
    onOpen();
  }

  function onCloseModal() {
    setSelectedSkin({});
    onClose();
  }

  return (
    <>
      <Head>
        <title>Cajas por skins</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQxnaecIT8Wv9rilYTYkfTyNuiFwmhUvpZz3-2Z9oqg0Vew80NvZzuiJdeLMlhpwFO-XdA/330x192" />
      </Head>
      <main>

        <Container
          as="section"
          w="100%"
          maxW="container.xl"
          position="relative"
          display="flex"
          flexDirection="column"
        >

          {!loading && (
            <Box>
              <Box display='flex' justifyContent='center' mt='3rem' fontSize={{ sm: '4xl', md: '3xl', lg: '5xl' }} fontWeight="semibold">
                <Text
                  as="h1"
                  lineHeight="normal"
                  fontWeight="bold"
                  mt="-2"
                  mr='0.5rem'
                  fontSize={{ sm: '5xl', md: '5xl', lg: '6xl' }}
                >
                  ¡Cambia tus
                </Text>
                <Text
                  as="h1"
                  fontWeight="800"
                  lineHeight="normal"
                  bgGradient="linear(to-r, red.500, red.600, red.500)"
                  bgClip="text"
                  mt="-2"
                  mr='0.5rem'
                  fontSize={{ sm: '5xl', md: '5xl', lg: '6xl' }}
                >
                  Cajas
                </Text>
                <Text
                  as="h1"
                  lineHeight="normal"
                  fontWeight="bold"
                  mt="-2"
                  mr='0.5rem'
                  fontSize={{ sm: '5xl', md: '5xl', lg: '6xl' }}
                >
                  por
                </Text>
                <Text
                  as="h1"
                  fontWeight="800"
                  lineHeight="normal"
                  bgGradient="linear(to-r, red.500, red.600, red.500)"
                  bgClip="text"
                  mt="-2"
                  fontSize={{ sm: '5xl', md: '5xl', lg: '6xl' }}
                >
                  Skins
                </Text>
                <Text
                  as="h1"
                  lineHeight="normal"
                  fontWeight="bold"
                  mt="-2"
                  fontSize={{ sm: '5xl', md: '5xl', lg: '6xl' }}
                >
                  !
                </Text>
              </Box>

              <Box
                as="section"
                textAlign="center"
                position="relative"
                w="100%"
                mb={'1rem'}
                mt={'2rem'}
              >
                <Box display='flex' flexDir='column' alignItems='center' gap={2}>
                  <Box className="scale-image">
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
                            <Tooltip borderRadius='9px' placement='top' label="Contáctame por Steam" aria-label="Contáctame por Steam">
                              <Box boxShadow='md' _hover={{ 'transform': 'scale(1.1)', 'msTransformOrigin': '50% 50%' }} transition='transform .4s'>
                                <Link href="https://steamcommunity.com/id/FireWolf__CSGO" rel="noopener noreferrer" target="_blank">
                                  <BsSteam fontSize='1.5rem' />
                                </Link>
                              </Box>
                            </Tooltip>
                          )}

                          {contact.Nombre == 'Discord' && contact.Ocultar == 'FALSE' && (
                            <Tooltip borderRadius='9px' placement='top' label="Contáctame por Discord" aria-label="Contáctame por Discord">
                              <Box boxShadow='md' _hover={{ 'transform': 'scale(1.2)', 'msTransformOrigin': '50% 50%' }} transition='transform .4s'>
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

              <Box
                display="flex"
                flexDirection="column"
                width="100%" boxShadow='md'
              >

                <Text
                  fontWeight="800"
                  lineHeight="normal"
                  bgGradient="linear(to-r, red.500, red.600, red.500)"
                  bgClip="text"
                  mr='0.5rem'
                  fontSize={'3xl'}>Skins disponibles</Text>
                <Box display='flex' flexWrap='wrap' alignItems='center' mt='1rem' gap={5} bg='#23272e' p={4} borderRadius='9px'>

                  {!skinsAreLoading && skins.map((skin) => (
                    <Box onClick={() => onOpenModal(skin)} boxShadow='md' key={skin.Nombre} position='relative' bg='#1e2227' _hover={{ 'bg': '#3f3f45' }} cursor='pointer' borderRadius='9px'>
                      <Box className="skin-image-container" position='relative' minW='13rem' w='13rem' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                        <Box h='5.5rem' mt='-0.7rem'>
                          <Image className="shadow-for-skin-image" alt={skin.Nombre} width={130} height={130} style={{ 'objectFit': "cover" }} src={skin.ImagenURL}></Image>
                        </Box>

                        <Box w='100%' px={3} display='flex' flexDir='column'>
                          <Text fontWeight="semibold" fontSize='sm' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' borderBottom='1px solid #d13535' pb={2}>{skin.Nombre} </Text>

                          <Box display='flex' justifyContent='space-between' w='100%' pt={1}>

                            <Box display='flex' justifyContent='start' gap={1}>
                              {skin.StatTrak == 'TRUE' && (
                                <Tooltip borderRadius='9px' placement='bottom' label="Este artículo registra el número de víctimas" aria-label="Este artículo registra el número de víctimas">
                                  <Box display='flex' alignItems='center' gap={1}>
                                    <Text color="#bc734f" fontWeight="500" fontSize='sm'>ST</Text>
                                    <Divider orientation="vertical" h='70%' alignSelf='center' borderLeftWidth='2px' borderColor='#808080' />
                                  </Box>
                                </Tooltip>
                              )}
                              <Text color="grey" fontWeight="500" fontSize='sm'>{skin.WearShorter}</Text>
                              <Divider orientation="vertical" h='70%' alignSelf='center' borderLeftWidth='2px' borderColor='#808080' />
                              <Text color="grey" fontWeight="500" fontSize='sm'>{skin.Float?.slice(0, 6)}</Text>
                            </Box>

                            <Tooltip borderRadius='9px' placement='bottom' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                              <Box display='flex' alignItems='center'>
                                {skin.TradeLock && (
                                  <Box display='flex' alignItems='center' gap={2}>
                                    <HiLockClosed color="grey" style={{ 'marginRight': '-0.4rem' }} fontSize='1.3rem' />
                                    <Text color="grey" fontWeight="500" fontSize='sm'>{skin.TradeLock}</Text>
                                  </Box>
                                )}
                              </Box>
                            </Tooltip>

                          </Box>
                        </Box>
                      </Box>

                      <Box position='absolute' top='0.5rem' right='0.4rem'>
                        {skin.Sticker1 && (
                          <Tooltip borderRadius='9px' placement='right' label={skin.Sticker1Nombre} aria-label={skin.Sticker1Nombre}>
                            <Box>
                              <Image className="shadow-for-skin-image" alt={skin.Nombre + 'sticker 1'} width='28' height='28' style={{ 'objectFit': "cover" }} src={skin.Sticker1}></Image>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      <Box position='absolute' top='2rem' right='0.4rem'>
                        {skin.Sticker2 && (
                          <Tooltip borderRadius='9px' placement='right' label={skin.Sticker2Nombre} aria-label={skin.Sticker2Nombre}>
                            <Box >
                              <Image className="shadow-for-skin-image" alt={skin.Nombre + 'sticker 2'} width='28' height='28' style={{ 'objectFit': "cover" }} src={skin.Sticker2}></Image>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      <Box position='absolute' top='3.5rem' right='0.4rem'>
                        {skin.Sticker3 && (
                          <Tooltip borderRadius='9px' placement='right' label={skin.Sticker3Nombre} aria-label={skin.Sticker3Nombre}>
                            <Box >
                              <Image className="shadow-for-skin-image" alt={skin.Nombre + 'sticker 3'} width='28' height='28' style={{ 'objectFit': "cover" }} src={skin.Sticker3}></Image>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      <Box position='absolute' top='5rem' right='0.4rem'>
                        {skin.Sticker4 && (
                          <Tooltip borderRadius='9px' placement='right' label={skin.Sticker4Nombre} aria-label={skin.Sticker4Nombre}>
                            <Box >
                              <Image className="shadow-for-skin-image" alt={skin.Nombre + 'sticker 4'} width='28' height='28' style={{ 'objectFit': "cover" }} src={skin.Sticker4}></Image>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  ))}

                  {skinsAreLoading && (
                    <Box minH='13rem' w='100%' display='flex' alignItems='center' flexWrap='wrap' gap={6}>
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                    </Box>
                  )}

                  {loading && (
                    <Box minH='13rem' w='100%' display='flex' alignItems='center' flexWrap='wrap' gap={6}>
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                      <Skeleton borderRadius='9px' height='12rem' w='13rem' />
                    </Box>
                  )}

                </Box>

              </Box>

              <Text
                fontWeight="normal"
                mt='0.5rem'
                color='gray.600'
                lineHeight="normal"
                fontSize={'sm'}>* Todas las imágenes son meramente ilustrativas</Text>

              <Modal isOpen={isOpen} onClose={onCloseModal} isCentered>
                <ModalOverlay backdropFilter='auto'
                  backdropBlur='2px' />
                <ModalContent bg='#1e2227'>
                  <ModalHeader>{selectedSkin.Nombre}</ModalHeader>
                  <ModalCloseButton mt='0.5rem' />

                  <Box borderBottom='1px solid #d13535' mr='1.6rem' ml='1.6rem'></Box>

                  <ModalBody pb='1.5rem' mt='1rem' >


                    <Box key={selectedSkin.Nombre} position='relative' mt='-0.2rem' p='0.5rem' bg='#23272e' borderRadius='9px' boxShadow='md'>
                      <Box position='relative' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                        <Box className="skin-image-container" display='flex' justifyContent='center' w='100%'>
                          <Image className="shadow-for-skin-image" alt={selectedSkin.Nombre} width='300' height='300' style={{ 'objectFit': "cover" }} src={selectedSkin.ImagenURL}></Image>
                        </Box>

                        {/* <Divider w='95%' bg='#d13535' h='1px' borderBottomWidth={0} opacity={1} /> */}

                        <Box display='flex' pb='0.5rem' mt='-0.5rem'>

                          {selectedSkin.Sticker1 && (
                            <Tooltip borderRadius='9px' placement='top' label={selectedSkin.Sticker1Nombre} aria-label={selectedSkin.Sticker1Nombre}>
                              <Box className="skin-image-container">
                                <Image className="shadow-for-skin-image" alt={selectedSkin.Nombre + 'sticker 1'} width='90' height='90' style={{ 'objectFit': "cover" }} src={selectedSkin.Sticker1}></Image>
                              </Box>
                            </Tooltip>
                          )}

                          {selectedSkin.Sticker2 && (
                            <Tooltip borderRadius='9px' placement='top' label={selectedSkin.Sticker2Nombre} aria-label={selectedSkin.Sticker2Nombre}>
                              <Box className="skin-image-container">
                                <Image className="shadow-for-skin-image" alt={selectedSkin.Nombre + 'sticker 2'} width='90' height='90' style={{ 'objectFit': "cover" }} src={selectedSkin.Sticker2}></Image>
                              </Box>
                            </Tooltip>
                          )}

                          {selectedSkin.Sticker3 && (
                            <Tooltip borderRadius='9px' placement='top' label={selectedSkin.Sticker3Nombre} aria-label={selectedSkin.Sticker3Nombre}>
                              <Box className="skin-image-container">
                                <Image className="shadow-for-skin-image" alt={selectedSkin.Nombre + 'sticker 3'} width='90' height='90' style={{ 'objectFit': "cover" }} src={selectedSkin.Sticker3}></Image>
                              </Box>
                            </Tooltip>
                          )}

                          {selectedSkin.Sticker4 && (
                            <Tooltip borderRadius='9px' placement='top' label={selectedSkin.Sticker4Nombre} aria-label={selectedSkin.Sticker4Nombre}>
                              <Box className="skin-image-container">
                                <Image className="shadow-for-skin-image" alt={selectedSkin.Nombre + 'sticker 4'} width='90' height='90' style={{ 'objectFit': "cover" }} src={selectedSkin.Sticker4}></Image>
                              </Box>
                            </Tooltip>
                          )}
                        </Box>

                      </Box>

                      <Box w='100%' px={3} display='flex' flexDir='column'>

                        <Box display='flex' flexDir='column' justifyContent='space-b' w='100%' pt={1}>

                          <Box display='flex' w='100%' h='8px' position='relative'>

                            <Box position='absolute' top='-1.1rem' ml='-9px' left={`${selectedSkin.Float * 100}%`}>
                              <TiArrowSortedDown fontSize='1.3rem' />
                            </Box>

                            <Tooltip borderRadius='9px' placement='top' label='Factory New' aria-label='Factory New'>
                              <Box w='7%' bg='#3d818f' borderRadius='50px 0 0 50px'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Minimal Wear' aria-label='Minimal Wear'>
                              <Box w='8%' bg='#84b235'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Field Tested' aria-label='Field Tested'>
                              <Box w='23%' bg='#dfc04a'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Well Worn' aria-label='Well Worn'>
                              <Box w='7%' bg='#ef8641'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Battle Scarred' aria-label='Battle Scarred'>
                              <Box w='55%' bg='#eb5757' borderRadius='0 50px 50px 0'></Box>
                            </Tooltip>

                          </Box>

                          <Box display='flex' justifyContent='space-between' pt={1}>

                            <Box display='flex' alignItems='center' gap={1}>
                              <Text color='grey' fontWeight="500" fontSize='sm'>Float</Text>
                              <Divider orientation="vertical" h='70%' alignSelf='center' borderLeftWidth='2px' borderColor='#808080' />
                              <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin.Float?.slice(0, 6)}</Text>
                            </Box>

                            <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin.Wear}</Text>
                          </Box>

                        </Box>

                        {selectedSkin.StatTrak && (
                          <Tooltip borderRadius='9px' placement='left' label="Este artículo registra el número de víctimas" aria-label="Este artículo registra el número de víctimas">
                            <Box display='flex' alignItems='center' position='absolute' gap={2} top='0.7rem' left='0.6rem'>
                              <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(188, 115, 77, .15)' borderRadius='9px'>
                                <Text color='#bc734d' fontWeight='semibold' fontSize='sm'>StatTrack</Text>
                              </Box>
                            </Box>
                          </Tooltip>
                        )}

                        {selectedSkin.TradeLock && (
                          <Tooltip borderRadius='9px' placement='right' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                            <Box display='flex' alignItems='center' position='absolute' gap={2} top='0.7rem' right='0.6rem'>
                              <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(208, 56, 56, .15)' borderRadius='9px'>
                                <Text color='#cd6060' fontWeight='semibold' fontSize='sm'>TradeLock {selectedSkin.TradeLock}</Text>
                                <HiLockClosed color='#cd6060' fontSize='1.2rem' />
                              </Box>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>

                  </ModalBody>

                </ModalContent>
              </Modal>

            </Box>
          )}

          {loading && (
            <Box h='100vh' w='100%' display='flex' justifyContent='center' alignItems='center'>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.700'
                size='xl'
              />
            </Box>
          )}

        </Container>
      </main>
    </>
  )
}
