import { Box, Button, Container, Divider, Input, InputGroup, InputLeftElement, InputRightElement, SkeletonCircle, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api from "./api/api";
import { HiLockClosed } from 'react-icons/hi';
import { BsDiscord, BsSteam } from 'react-icons/bs';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FiExternalLink } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
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
  const [filteredSkins, setFilteredSkins] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchInputIsLoading, setSearchInputIsLoading] = useState(false);
  const [paginator, setPaginator] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGINATOR_ITEMS = 10;

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setSearchText('');
    setLoading(true);
    setSkinsAreLoading(true);

    fetchData();
  }, []);

  const fetchData = async () => {
    const skins = await api.skins.get();
    setSkins(skins);
    generatePaginator(skins);
    setSkinsBasedOnPage(currentPage, skins);

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

  function onChangeSearchText(text) {
    setSearchInputIsLoading(true);
    setSearchText(text);
    const filteredSkins = skins.filter(skin => skin.Nombre.toLowerCase().includes(text.toLowerCase()));
    generatePaginator(filteredSkins);
    setSkinsBasedOnPage(1, filteredSkins);
    setSearchInputIsLoading(false);
  }

  function generatePaginator(skins) {
    const paginator = [];
    for (let i = 0; i <= skins.length / PAGINATOR_ITEMS; i++) {
      paginator.push(i + 1);
    }
    setPaginator(paginator);
  }

  function setSkinsBasedOnPage(newPage, skins) {
    if (newPage == 1) setCurrentPage(1);
    const skinsToSet = skins.slice((newPage - 1) * PAGINATOR_ITEMS, newPage * PAGINATOR_ITEMS);
    setFilteredSkins(skinsToSet);
  }

  function onPageChange(newPage, skins) {
    setCurrentPage(newPage);
    setSkinsBasedOnPage(newPage, skins);
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
            <Box pb='2rem'>
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

              <Box as="section" textAlign="center" position="relative" w="100%" mb={'1rem'} mt={{ sm: '1rem', md: '2rem' }} >
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
                            <Tooltip borderRadius='9px' placement='bottom' label="Contáctame por Steam" aria-label="Contáctame por Steam">
                              <Box boxShadow='md' _hover={{ 'transform': 'scale(1.05)', 'msTransformOrigin': '50% 50%' }} transition='transform .4s'>
                                <Link href="https://steamcommunity.com/id/FireWolf__CSGO" rel="noopener noreferrer" target="_blank">
                                  <BsSteam fontSize='1.5rem' />
                                </Link>
                              </Box>
                            </Tooltip>
                          )}

                          {contact.Nombre == 'Discord' && contact.Ocultar == 'FALSE' && (
                            <Tooltip borderRadius='9px' placement='bottom' label="Contáctame por Discord" aria-label="Contáctame por Discord">
                              <Box boxShadow='md' _hover={{ 'transform': 'scale(1.05)', 'msTransformOrigin': '50% 50%' }} transition='transform .4s'>
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

              <Box display="flex" flexDirection="column" width="100%" boxShadow='md' >

                <Box w='100%' display='flex' flexDir={{ sm: 'column', md: 'row', lg: 'row' }} alignItems='center' justifyContent='space-between'>
                  <Text fontWeight="800" lineHeight="normal" bgGradient="linear(to-r, red.500, red.600, red.500)" bgClip="text" mr='0.5rem' fontSize={'3xl'}>Skins disponibles</Text>

                  <Box display={{ sm: 'none', md: 'flex' }}>
                    <InputGroup>
                      {!searchInputIsLoading && (
                        <InputRightElement pointerEvents='none' children={<IoSearch fontSize='1.1rem' color='#718096' />} />
                      )}
                      <Input className="input-search" value={searchText}
                        onChange={(e) => onChangeSearchText(e.target.value)} w='17rem' fontSize='sm' bg='transparent' border='1px solid #d13535' _hover={{ 'border': '1px solid #d13535' }} _focusVisible={{ 'border': '1px solid #d13535' }} _focus={{ 'border': '1px solid #d13535' }} borderRadius='9px' placeholder="Busca una skin..." />
                      {searchInputIsLoading && (
                        <InputRightElement pointerEvents='none' children={<Spinner size='sm' speed='0.65s' />} />
                      )}
                    </InputGroup>
                  </Box>

                </Box>
                <Box position='relative' display='flex' flexWrap='wrap' alignContent='flex-start' justifyContent='center' mt='1rem' gap={{ sm: 2, md: 6 }} bg='#23272e' py={4} px={0} borderRadius='9px' minH='28rem' pb='4.5rem'>

                  <Box display={{ sm: 'flex', md: 'none' }} w='100%' ml='1rem' mr='1rem'>
                    <InputGroup>
                      {!searchInputIsLoading && (
                        <InputRightElement pointerEvents='none' children={<IoSearch fontSize='1.1rem' color='#718096' />} />
                      )}
                      <Input className="input-search" value={searchText}
                        onChange={(e) => onChangeSearchText(e.target.value)} fontSize='sm' bg='transparent' border='1px solid #d13535' _hover={{ 'border': '1px solid #d13535' }} _focusVisible={{ 'border': '1px solid #d13535' }} _focus={{ 'border': '1px solid #d13535' }} borderRadius='9px' placeholder="Busca una skin..." />
                      {searchInputIsLoading && (
                        <InputRightElement pointerEvents='none' children={<Spinner size='sm' speed='0.65s' />} />
                      )}
                    </InputGroup>
                  </Box>

                  {!skinsAreLoading && filteredSkins.map((skin, index) => (
                    <Box onClick={() => onOpenModal(skin)} boxShadow='md' key={skin.Nombre + skin.Float + index} position='relative' bg='#1e2227' h={{ sm: 'auto', md: '10.5rem' }} minW={{ sm: '45%', md: '13rem' }} w={{ sm: '45%', md: '13rem' }} _hover={{ 'bg': '#3f3f45' }} cursor='pointer' borderRadius='9px'>
                      <Box className="skin-image-container" position='relative' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                        <Box h='5.5rem' mt={{ sm: '-1.6rem', md: '-0.7rem' }} p={{ sm: 4, md: 0 }}>
                          <Image className="shadow-for-skin-image" alt={skin.Nombre} width={130} height={130} style={{ 'objectFit': "cover" }} src={skin.ImagenURL}></Image>
                        </Box>

                        <Box w='100%' px={3} display='flex' flexDir='column'>
                          <Text fontWeight="semibold" fontSize='sm' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' pb={2}>{skin.Nombre} </Text>


                          <Box display='flex' w='100%' h='4px'>

                            <Tooltip borderRadius='9px' placement='top' label='Factory New' aria-label='Factory New'>
                              <Box w={(skin.Float * 100) > 7 ? '7%' : `${skin.Float * 100}%`} bg='#3d818f' borderRadius='50px 0 0 50px'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Minimal Wear' aria-label='Minimal Wear'>
                              <Box w={(skin.Float * 100) <= 7 ? '0%' : (skin.Float * 100) > 8 ? '8%' : `${skin.Float * 100}%`} bg='#84b235'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Field Tested' aria-label='Field Tested'>
                              <Box w={(skin.Float * 100) <= 15 ? '0%' : (skin.Float * 100) > 23 ? '23%' : `${skin.Float * 100}%`} bg='#dfc04a'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Well Worn' aria-label='Well Worn'>
                              <Box w={(skin.Float * 100) <= 38 ? '0%' : (skin.Float * 100) > 7 ? '7%' : `${skin.Float * 100}%`} bg='#ef8641'></Box>
                            </Tooltip>

                            <Tooltip borderRadius='9px' placement='top' label='Battle Scarred' aria-label='Battle Scarred'>
                              <Box w={(skin.Float * 100) <= 45 ? '0%' : `${(skin.Float * 100) - 45}%`} bg='#eb5757' borderRadius='0 50px 50px 0'></Box>
                            </Tooltip>

                          </Box>

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
                              <Text color="grey" fontWeight="500" fontSize='sm'>{skin.Float?.slice(0, 4)}</Text>
                            </Box>

                            <Tooltip borderRadius='9px' placement='bottom' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                              <Box display='flex' alignItems='center'>
                                {skin.TradeLock && (
                                  <Box display='flex' alignItems='center' gap={2}>
                                    <HiLockClosed color="grey" style={{ 'marginRight': '-0.4rem' }} fontSize='1.3rem' />
                                    <Text display={{ sm: 'none', md: 'flex' }} color="grey" fontWeight="500" fontSize='sm'>{skin.TradeLock}</Text>
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

                  {paginator.length > 0 && filteredSkins != 0 && (
                    <Box display='flex' justifyContent='center' alignItems='center' w='100%' gap={3} position='absolute' bottom='1rem'>
                      <>
                        <Text display={{ sm: 'none', md: 'flex' }} color='grey'>Mostrando {((currentPage - 1) * PAGINATOR_ITEMS) + 1}-{(currentPage * PAGINATOR_ITEMS) > skins.length ? skins.length : (currentPage * PAGINATOR_ITEMS)} de {skins.length} artículos</Text>
                        {paginator.map((page, index) => (
                          <Button fontSize='sm' border='1px solid #d13535' _hover={{ 'bg': '#d13535', 'color': '#fff' }} bg={currentPage == page ? '#d13535' : 'transparent'}
                            borderRadius='9px' key={index} onClick={() => onPageChange(page, skins)}>{page}</Button>
                        ))}
                      </>
                    </Box>
                  )}

                  {!skinsAreLoading && searchText.length > 0 && filteredSkins.length == 0 && (
                    <Box display='flex' justifyContent='center' alignItems='center' flexDirection='col' w='100%' h='22.25rem'>
                      <Box display='flex' flexDirection='column' alignItems='center' gap={2} px={{ sm: 8, md: 0 }} textAlign={{ sm: 'center', md: 'left' }}>
                        <IoSearch color='#c73131' fontSize='3rem' />
                        <Text>No se encontraron artículos con ese criterio de búsqueda</Text>
                      </Box>
                    </Box>
                  )}

                  {skinsAreLoading && (
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

              <Text fontWeight="normal" mt='0.5rem' color='gray.600' lineHeight="normal" fontSize={'sm'}>
                * Todas las imágenes son meramente ilustrativas</Text>

              <Modal isOpen={isOpen} size={{ sm: 'full', md: 'md' }} onClose={onCloseModal} isCentered>
                <ModalOverlay backdropFilter='auto'
                  backdropBlur='2px' />
                <ModalContent bg='#1e2227'>
                  <ModalHeader>{selectedSkin.Nombre}</ModalHeader>
                  <ModalCloseButton _focus={{ 'boxShadow': 'none' }} _focusVisible={{ 'boxShadow': 'none' }} mt='0.5rem' />

                  <Box borderBottom='1px solid #d13535' mr='1.6rem' ml='1.6rem'></Box>

                  <ModalBody pb='1.5rem' mt='1rem' display={{ sm: 'flex', md: 'block' }} alignItems={{ sm: 'center', md: '' }} justifyContent={{ sm: 'center', md: '' }}>

                    <Box key={selectedSkin.Nombre} position='relative' mt='-0.2rem' p='0.5rem' bg='#23272e' borderRadius='9px' boxShadow='md'>
                      <Box position='relative' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                        <Box className="skin-image-container" display='flex' justifyContent='center' w='100%' maxH='15rem' h='auto'>
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

                        <Box display='flex' flexDir='column' justifyContent='space-between' w='100%' pt={1}>

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
                              <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin.Float?.slice(0, 4)}</Text>
                            </Box>

                            <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin.Wear}</Text>
                          </Box>

                        </Box>

                        {selectedSkin.StatTrak && (
                          <Tooltip borderRadius='9px' placement='left' label="Este artículo registra el número de víctimas" aria-label="Este artículo registra el número de víctimas">
                            <Box display='flex' alignItems='center' position='absolute' gap={2} top='0.7rem' left='1.1rem'>
                              <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(188, 115, 77, .15)' borderRadius='9px'>
                                <Text color='#bc734d' fontWeight='600' fontSize='sm'>StatTrack</Text>
                              </Box>
                            </Box>
                          </Tooltip>
                        )}

                        {selectedSkin.TradeLock && (
                          <Tooltip borderRadius='9px' placement='right' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                            <Box display='flex' alignItems='center' position='absolute' gap={2} top='0.7rem' right='1.1rem'>
                              <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(208, 56, 56, .15)' borderRadius='9px'>
                                <Text color='#cd6060' fontWeight='600' fontSize='sm'>TradeLock {selectedSkin.TradeLock}</Text>
                                <HiLockClosed color='#cd6060' fontSize='1.2rem' />
                              </Box>
                            </Box>
                          </Tooltip>
                        )}

                        {selectedSkin.InspeccionarLink && (
                          <Link w='100%' href={selectedSkin.InspeccionarLink} rel="noopener noreferrer" target="_blank">
                            <Button w='100%' leftIcon={<FiExternalLink fontSize='1.1rem' />} fontSize='sm' mt='1rem' mb='0.5rem' bg='transparent' border='1px solid #d13535' _hover={{ 'bg': '#d13535', 'color': '#fff' }} borderRadius='9px'>Inspeccionar en el juego</Button>
                          </Link>
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
                size='xl'
              />
            </Box>
          )}

        </Container>
      </main>
    </>
  )
}
