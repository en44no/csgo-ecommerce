import { Box, Button, Container, Divider, Input, InputGroup, Img, InputRightElement, Spinner, Text, useDisclosure, useMediaQuery, Select, FormControl, FormLabel, Switch, filter } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "./api/api";
import { HiLockClosed, HiLockOpen } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { RiVolumeUpLine, RiVolumeMuteLine } from 'react-icons/ri';
import { FiExternalLink } from 'react-icons/fi';
import { IoSearch, IoClose } from 'react-icons/io5';
import { Skeleton } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import Info from "../components/Info";
import HeaderText from "../components/HeaderText";
import TooltipP from "../components/Tooltip";

export default function Home() {

  const [skins, setSkins] = useState([]);
  const [selectedSkin, setSelectedSkin] = useState({});
  const [contactLinks, setContactLinks] = useState([]);
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState([]);
  const [skinsAreLoading, setSkinsAreLoading] = useState([]);
  const [filteredSkins, setFilteredSkins] = useState([]);
  const [skinsForCurrentPage, setSkinsForCurrentPage] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchInputIsLoading, setSearchInputIsLoading] = useState(false);
  const [paginator, setPaginator] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [soundIsEnabled, setSoundIsEnabled] = useState(false);

  //Filters
  const [showLockedItemsFilter, setShowLockedItemsFilter] = useState(false);

  const [isMobile] = useMediaQuery('(max-width: 479px)');
  const PAGINATOR_ITEMS = isMobile ? 20 : 25;

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setAwpScopeAudio(new Audio('/sounds/awp-zoom.mp3'));
    setAwpShootAudio(new Audio('/sounds/awp-shoot.mp3'));
    setGoGoGoAudio(new Audio('/sounds/go-go-go.mp3'));

    setSoundIsEnabled(false);
    setSearchText('');
    setCurrentPage(1);

    setLoading(true);
    setSkinsAreLoading(true);

    fetchData();
  }, []);

  const fetchData = async () => {
    const skins = await api.skins.get();

    //reset filters
    setShowLockedItemsFilter(true);
    setSearchText('');

    setSkins(skins);
    setFilteredSkins(skins);
    generatePaginator(skins);
    setSkinsBasedOnPage(1, skins);

    setSkinsAreLoading(false);

    setContactLinks(await api.contact.get());
    setInfo(await api.info.get());
    setLoading(false);
  };

  function onOpenModal(skin) {
    playShootSound();
    setSelectedSkin(skin);
    onOpen();
  }

  function onCloseModal() {
    setSelectedSkin({});
    onClose();
  }

  function onChangeSearchText(text) {
    debugger;
    setSearchInputIsLoading(true);
    setSearchText(text);
    setFilters(text);
    setSearchInputIsLoading(false);
  }

  function onShowLockedItemsChange(show) {
    setShowLockedItemsFilter(show);
    setFilters(searchText, show);
  }

  function generatePaginator(skins) {
    const paginator = [];
    for (let i = 0; i < skins.length / PAGINATOR_ITEMS; i++) {
      paginator.push(i + 1);
    }
    setPaginator(paginator);
  }

  function onPageChange(newPage) {
    setCurrentPage(newPage);
    setSkinsBasedOnPage(newPage);
  }

  function clearSearchText() {
    onChangeSearchText('');
    setSkinsBasedOnPage(1, skins);
  }

  const [awpScopeAudio, setAwpScopeAudio] = useState(null);
  const [awpShootAudio, setAwpShootAudio] = useState(null);
  const [goGoGoAudio, setGoGoGoAudio] = useState(null);

  const playGoGoGoSound = () => {
    if (soundIsEnabled && !isMobile) {
      if (goGoGoAudio) {
        goGoGoAudio.volume = 0.1;
        goGoGoAudio.play();
        setTimeout(() => {
          goGoGoAudio.pause();
          goGoGoAudio.currentTime = 0;
        }, 1000);
      }
    }
  };

  const playScopeSound = () => {
    if (soundIsEnabled && !isMobile) {
      const audios = document.querySelectorAll('audio');

      if (awpScopeAudio) {
        // detener cualquier reproducción anterior
        audios.forEach(a => {
          if (!a.paused) {
            a.pause();
            a.currentTime = 0;
          }
        });

        // reproducir el nuevo audio
        awpScopeAudio.volume = 0.1;
        awpScopeAudio.play();
      }
    }
  };

  const playShootSound = () => {
    if (soundIsEnabled && !isMobile) {
      if (awpShootAudio) {
        awpShootAudio.volume = 0.1;
        awpShootAudio.play();
        setTimeout(() => {
          awpShootAudio.pause();
          awpShootAudio.currentTime = 0;
        }, 1000);
      }
    }
  };

  const pauseScopeSound = () => {
    if (soundIsEnabled && !isMobile) {
      if (awpScopeAudio) {
        awpScopeAudio.pause();
        awpScopeAudio.currentTime = 0;
      }
    }
  };

  const toggleSound = () => {
    setSoundIsEnabled(!soundIsEnabled);
  };

  const setFilters = (text, showLockedItems) => {
    let textFilter = text != null ? text : searchText;
    let skinsWithFilters = filteredSkins ? filteredSkins : skins;

    let tradeLockFilter = showLockedItems != null ? showLockedItems : showLockedItemsFilter;

    if (textFilter) {
      skinsWithFilters = skins.filter(skin => {
        return skin.Nombre.toLowerCase().includes(textFilter.toLowerCase()) ? skin : null;
      });
    }

    if (tradeLockFilter == false) {
      skinsWithFilters = skinsWithFilters.filter(skin => {
        return skin.TradeLock == null || skin.TradeLock == 'FALSE' ? skin : null;
      });
    } else if (tradeLockFilter == true) {
      skinsWithFilters = skins;

      if (textFilter) {
        skinsWithFilters = skinsWithFilters.filter(skin => {
          return skin.Nombre.toLowerCase().includes(textFilter.toLowerCase()) ? skin : null;
        });
      }
    }

    setFilteredSkins(skinsWithFilters);
    setSkinsBasedOnPage(currentPage, skinsWithFilters);
  };

  // function setFiltersAndOrder(newShowLockedItemsFilter, newSearchText) {
  //   let searchTextToCheck = newSearchText ? newSearchText : searchText;
  //   let showLockedItemsFilterToCheck = newShowLockedItemsFilter ? newShowLockedItemsFilter : showLockedItemsFilter;

  //   let skinsCopy = [...skins];
  //   debugger;

  //   const filteredSkins = skinsCopy.filter(skin => {
  //     if (showLockedItemsFilterToCheck && searchTextToCheck) {
  //       return (skin.Nombre.toLowerCase().includes(searchTextToCheck.toLowerCase())) ? skin : null;
  //     }
  //     else if (!showLockedItemsFilterToCheck && searchTextToCheck) {
  //       return (skin.TradeLock == null || skin.TradeLock == 'FALSE') && skin.Nombre.toLowerCase().includes(searchTextToCheck.toLowerCase()) ? skin : null;
  //     }
  //     else if (showLockedItemsFilterToCheck) {
  //       return skin;
  //     }
  //     else if (searchTextToCheck) {
  //       return skin.Nombre.toLowerCase().includes(searchTextToCheck.toLowerCase()) ? skin : null;
  //     } else {
  //       return (skin.TradeLock == null || skin.TradeLock == 'FALSE') ? skin : null
  //     }
  //   });

  //   let skinsToSet = [];

  //   let currentPageToCheck = currentPage;
  //   while (currentPageToCheck >= 0) { // mientras no lleguemos a la primera página
  //     let skinsOnCurrentPage = setSkinsBasedOnPage(currentPageToCheck, filteredSkins);
  //     if (skinsOnCurrentPage.length > 0) { // si hay skins en la página actual
  //       skinsToSet = skinsOnCurrentPage;
  //       break; // salimos del loop
  //     } else { // si no hay skins en la página actual (estamos en una página vacía)
  //       currentPageToCheck = currentPageToCheck - 1  // retrocedemos una página
  //       setCurrentPage(currentPageToCheck);
  //     }

  //     if (currentPageToCheck == 0) break; // si llegamos a la primera página, salimos del loop (no hay skins en ninguna página
  //   }

  //   generatePaginator(filteredSkins);
  //   setFilteredSkins(filteredSkins);
  // }

  function setSkinsBasedOnPage(page, skinsToFilter) {
    let skinsForPage = [];
    if (skinsToFilter) {
      skinsForPage = skinsToFilter.slice((page - 1) * PAGINATOR_ITEMS, page * PAGINATOR_ITEMS);
    } else {
      skinsForPage = filteredSkins.slice((page - 1) * PAGINATOR_ITEMS, page * PAGINATOR_ITEMS);
    }

    if (skinsForPage.length == 0) {
      let currentPageToCheck = currentPage;
      while (currentPageToCheck >= 0) { // mientras no lleguemos a la primera página
        let skinsOnCurrentPage = [];
        if (skinsToFilter) {
          skinsOnCurrentPage = skinsToFilter.slice((currentPageToCheck - 1) * PAGINATOR_ITEMS, currentPageToCheck * PAGINATOR_ITEMS);
        } else {
          skinsOnCurrentPage = filteredSkins.slice((currentPageToCheck - 1) * PAGINATOR_ITEMS, currentPageToCheck * PAGINATOR_ITEMS);
        }
        if (skinsOnCurrentPage.length > 0) { // si hay skins en la página actual
          skinsForPage = skinsOnCurrentPage;
          break; // salimos del loop
        } else { // si no hay skins en la página actual (estamos en una página vacía)
          currentPageToCheck = currentPageToCheck - 1  // retrocedemos una página
          setCurrentPage(currentPageToCheck);
        }

        if (currentPageToCheck == 0) break; // si llegamos a la primera página, salimos del loop (no hay skins en ninguna página
      }
    }

    setSkinsForCurrentPage(skinsForPage);
    generatePaginator(skinsToFilter ? skinsToFilter : filteredSkins);
    return skinsForPage;
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

              <HeaderText />

              <Info isMobile={isMobile} contactLinks={contactLinks} info={info} />

              <Box display="flex" flexDirection="column" width="100%" boxShadow='md' >

                <Box w='100%' display='flex' flexDir={{ sm: 'column', md: 'row', lg: 'row' }} alignItems='center' justifyContent='space-between'>
                  <Text fontWeight="800" lineHeight="normal" bgGradient="linear(to-r, red.500, red.600, red.500)" bgClip="text" mr='0.5rem' fontSize={'3xl'}>Skins disponibles</Text>

                  <Box display={{ sm: 'none', md: 'flex' }} alignItems='center'>
                    <Box mr='0.8rem'>
                      {soundIsEnabled && (
                        <TooltipP placement='left' label='Los efectos de sonido están activados, haz click para desactivarlos'>
                          <Box>
                            <RiVolumeUpLine onClick={() => toggleSound()} fontSize='1.6rem' color='#718096' cursor='pointer' />
                          </Box>
                        </TooltipP>
                      )}
                      {!soundIsEnabled && (
                        <TooltipP placement='left' label='Los efectos de sonido están desactivados, haz click para activarlos'>
                          <Box>
                            <RiVolumeMuteLine onClick={() => toggleSound()} fontSize='1.6rem' color='#718096' cursor='pointer' />
                          </Box>
                        </TooltipP>
                      )}
                    </Box>
                  </Box>

                </Box>
                <Box position='relative' display='flex' flexWrap='wrap' alignContent='flex-start' justifyContent='center' mt='1rem' gap={{ sm: 2, md: 6 }} bg='#23272e' py={4} px={0} borderRadius='9px' minH='32rem' pb='4.5rem'>

                  <Box display='flex' flexDirection={{ sm: 'column', md: 'row' }} alignItems='center' gap={{ sm: 0, md: 3 }} justifyContent={{ sm: '', md: 'space-between' }} w='100%' mx='3.5rem' mb='-0.5rem'>

                    <InputGroup w='fit-content'>
                      {searchText.length == 0 && (
                        <InputRightElement pointerEvents='none' children={<IoSearch fontSize='1.1rem' color='#718096' />} />
                      )}
                      <Input value={searchText}
                        onChange={(e) => onChangeSearchText(e.target.value)} w='17rem' fontSize='sm' bg='transparent' border='none' borderRadius='0' borderBottom='1px solid #d13535' _hover={{ 'borderBottom': '1px solid #d13535' }} _focusVisible={{ 'borderBottom': '1px solid #d13535' }} _focus={{ 'borderBottom': '1px solid #d13535' }} placeholder="Busca una skin..." />
                      {searchText.length > 0 && (
                        <InputRightElement onClick={(e) => clearSearchText()} children={<IoClose fontSize='1.4rem' color='#718096' cursor='pointer' />} />
                      )}
                    </InputGroup>

                    <Box display='flex' alignItems='center' gap={3} mb={{ sm: '0.8rem', md: 0 }}>
                      {/* <Select onChange={(e) => onFloatOrderChange(e.target.value)} w='fit-content' fontSize='sm' bg='transparent' border='none' borderRadius='0' borderBottom='1px solid #d13535' _hover={{ 'borderBottom': '1px solid #d13535' }} _focusVisible={{ 'borderBottom': '1px solid #d13535' }} _focus={{ 'borderBottom': '1px solid #d13535' }}>
                        <option style={{ background: '#1e2227' }} value='lower' selected>Float más bajo</option>
                        <option style={{ background: '#1e2227' }} value='higher'>Float más alto</option>
                      </Select> */}

                      <Box border='none' borderBottom='1px solid #d13535' h='2.5rem' display='flex' px='0.5rem' alignItems='center'>
                        <FormControl display='flex' alignItems='center'>
                          <FormLabel fontSize='sm' fontWeight='normal' htmlFor='email-alerts' mb='0'>
                            TradeLock
                          </FormLabel>
                          <Switch isChecked={showLockedItemsFilter} onChange={(e) => onShowLockedItemsChange(e.target.checked)} id='email-alerts' colorScheme="red" />
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>

                  {!skinsAreLoading && skinsForCurrentPage.map((skin, index) => (
                    <Box onMouseOver={playScopeSound} onMouseLeave={pauseScopeSound} onClick={() => onOpenModal(skin)} boxShadow='md' key={skin.Nombre + skin.Float + index} position='relative' bg='#1e2227' h={{ sm: 'auto', md: '10.5rem' }} minW={{ sm: '45%', md: '13rem' }} w={{ sm: '45%', md: '13rem' }} _hover={{ 'bg': '#3f3f45' }} cursor='pointer' borderRadius='9px'>
                      <Box className={isMobile ? 'skin-image-container' : 'scale-image'} position='relative' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                        <Box h={{ sm: '6.5rem', md: '5.5rem' }} mt={{ sm: '-2rem', md: '-0.7rem' }} p={{ sm: 6, md: 0 }}>
                          <Img layout='responsive' className="shadow-for-skin-image" alt={skin.Nombre} width={{ sm: (skin.Float && skin.Wear) ? 'auto' : '6rem', md: (skin.Float && skin.Wear) ? '8.3rem' : '7rem' }} height='auto' style={{ 'objectFit': "cover" }} mt={(skin.Float && skin.Wear) ? '' : '0.5rem'} src={skin.ImagenURL}></Img>
                        </Box>

                        <Box w='100%' px={3} display='flex' flexDir='column'>
                          <Text fontWeight="semibold" fontSize='sm' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' pb={2}>{skin.Nombre} </Text>

                          <Box display='flex' w='100%' h='4px' mt='0.3rem' position='relative'>
                            {skin.Float && skin.Wear && (

                              <>
                                <Box position='absolute' top='-1.1rem' ml='-9px' left={`${skin.Float * 100}%`}>
                                  <TiArrowSortedDown fontSize='1.3rem' />
                                </Box>

                                <TooltipP backgroundColor='#2d3748' textColor='#ffffff' label='Factory New'>
                                  <Box w={'7%'} bg='#3d818f' borderRadius='50px 0 0 50px'></Box>
                                </TooltipP>

                                <TooltipP backgroundColor='#2d3748' textColor='#ffffff' label='Minimal Wear'>
                                  <Box w={'8%'} bg='#84b235'></Box>
                                </TooltipP>

                                <TooltipP backgroundColor='#2d3748' textColor='#ffffff' label='Field Tested'>
                                  <Box w={'23%'} bg='#dfc04a'></Box>
                                </TooltipP>

                                <TooltipP backgroundColor='#2d3748' textColor='#ffffff' label='Well Worn'>
                                  <Box w={'7%'} bg='#ef8641'></Box>
                                </TooltipP>

                                <TooltipP backgroundColor='#2d3748' textColor='#ffffff' label='Battle Scarred'>
                                  <Box w={'55%'} bg='#eb5757' borderRadius='0 50px 50px 0'></Box>
                                </TooltipP>
                              </>

                            )}
                          </Box>


                          <Box display='flex' justifyContent='space-between' w='100%' pt={1}>

                            <Box display='flex' justifyContent='start' gap={1}>
                              {skin.StatTrak == 'TRUE' && (
                                <TooltipP placement='bottom' label="Este artículo registra el número de víctimas" aria-label="Este artículo registra el número de víctimas">
                                  <Box display='flex' alignItems='center' gap={1}>
                                    <Text color="#bc734f" fontWeight="500" fontSize='sm'>ST</Text>
                                    <Divider orientation="vertical" h='70%' alignSelf='center' borderLeftWidth='2px' borderColor='#808080' />
                                  </Box>
                                </TooltipP>
                              )}

                              {skin.Float && skin.Wear && (
                                <>
                                  <Text color="grey" fontWeight="500" fontSize='sm'>{skin.WearShorter}</Text>
                                  <Divider orientation="vertical" h='70%' alignSelf='center' borderLeftWidth='2px' borderColor='#808080' />
                                  <Text color="grey" fontWeight="500" fontSize='sm'>{skin.Float?.slice(0, 5)}</Text>
                                </>
                              )}

                            </Box>

                            {skin.TradeLock ? (
                              <TooltipP placement='bottom' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                                <Box display='flex' alignItems='center'>
                                  <Box display='flex' alignItems='center' gap={2}>
                                    <HiLockClosed color="grey" style={{ 'marginRight': '-0.4rem' }} fontSize='1.3rem' />
                                    <Text display={{ sm: 'none', md: 'flex' }} color="grey" fontWeight="500" fontSize='sm'>{skin.TradeLock}</Text>
                                  </Box>
                                </Box>
                              </TooltipP>
                            ) : (
                              <TooltipP placement='bottom' label="Este artículo está disponible para ser enviado inmediatamente">
                                <Box display='flex' alignItems='center'>
                                  <Box display='flex' alignItems='center' gap={2}>
                                    <HiLockOpen color="#5fad68" fontSize='1.3rem' />
                                  </Box>
                                </Box>
                              </TooltipP>
                            )}

                          </Box>
                        </Box>
                      </Box>

                      {skin.Stickers?.map((sticker, index) => (
                        <Box key={sticker.Nombre + `sticker ${index}`} position='absolute' top={{ sm: index == 0 ? '0.5rem' : index == 1 ? '1.6rem' : index == 2 ? '2.7rem' : index == 3 ? '3.8rem' : 0, md: index == 0 ? '0.5rem' : index == 1 ? '2rem' : index == 2 ? '3.5rem' : index == 3 ? '5rem' : 0 }} right='0.4rem'>
                          <TooltipP placement='right' label={sticker.Nombre} >
                            <Box className={isMobile ? 'skin-image-container' : 'scale-image-sticker-home'}>
                              <Img layout='responsive' alt={sticker.Nombre + `sticker ${index}`} width={{ sm: '1rem', md: '1.7rem' }} height='auto' style={{ 'objectFit': "cover" }} src={sticker.Link}></Img>
                            </Box>
                          </TooltipP>
                        </Box>
                      ))}

                    </Box>
                  ))}

                  {paginator.length > 0 && skinsForCurrentPage != 0 && (
                    <Box display='flex' justifyContent='center' alignItems='center' w='100%' gap={3} position='absolute' bottom='1rem'>
                      <>
                        <Text display={{ sm: 'none', md: 'flex' }} color='grey'>Mostrando {(((currentPage - 1) * PAGINATOR_ITEMS) + 1) == 1 ? '01' : ((currentPage - 1) * PAGINATOR_ITEMS) + 1}-{(currentPage * PAGINATOR_ITEMS) > skins.length ? skins.length : (currentPage * PAGINATOR_ITEMS)} de {skins.length} artículos</Text>
                        {currentPage > 3 && (
                          <>
                            <Button
                              fontSize='sm'
                              fontWeight='normal'
                              _hover={{ 'bg': '#d13535', 'color': '#fff' }}
                              bg={'transparent'}
                              borderRadius='9px'
                              key={'first'}
                              onClick={() => onPageChange(1)}
                            >
                              1
                            </Button>
                            {currentPage > 3 && (
                              <Text>...</Text>
                            )}
                          </>
                        )}
                        {paginator.map((page, index) => {
                          if (isMobile && page > currentPage + 1) {
                            return null;
                          }
                          if (isMobile && page < currentPage - 1) {
                            return null;
                          }
                          if (!isMobile && page > currentPage + 2) {
                            return null;
                          }
                          if (!isMobile && page < currentPage - 2) {
                            return null;
                          }
                          return (
                            <Button
                              fontSize='sm'
                              fontWeight={currentPage == page ? 'bold' : 'normal'}
                              _hover={{ 'bg': '#d13535', 'color': '#fff' }}
                              bg={currentPage == page ? '#d13535' : 'transparent'}
                              borderRadius='9px'
                              key={index}
                              onClick={() => onPageChange(page)}
                            >
                              {page}
                            </Button>
                          )
                        })}
                        {currentPage < paginator[paginator.length - 1] - 2 && (
                          <>
                            {paginator[paginator.length - 1] - currentPage > 3 && (
                              <Text>...</Text>
                            )}
                            <Button
                              fontSize='sm'
                              fontWeight='normal'
                              _hover={{ 'bg': '#d13535', 'color': '#fff' }}
                              bg={'transparent'}
                              borderRadius='9px'
                              key={'last'}
                              onClick={() => onPageChange(paginator[paginator.length - 1])}
                              disabled={currentPage === paginator[paginator.length - 1]}
                            >
                              {paginator[paginator.length - 1]}
                            </Button>
                          </>
                        )}
                      </>
                    </Box>
                  )}

                  {!skinsAreLoading && searchText.length > 0 && skinsForCurrentPage.length == 0 && (
                    <Box display='flex' justifyContent='center' alignItems='center' flexDirection='col' w='100%' h='22.25rem'>
                      <Box display='flex' flexDirection='column' alignItems='center' gap={2} px={{ sm: 8, md: 0 }} textAlign={{ sm: 'center', md: 'left' }}>
                        <IoSearch color='#c73131' fontSize='3rem' />
                        <Text>No se encontraron artículos con ese criterio de búsqueda</Text>
                      </Box>
                    </Box>
                  )}

                  {!skinsAreLoading && searchText.length == 0 && skinsForCurrentPage.length == 0 && (
                    <Box display='flex' justifyContent='center' alignItems='center' flexDirection='col' w='100%' h='22.25rem'>
                      <Box display='flex' flexDirection='column' alignItems='center' gap={2} px={{ sm: 8, md: 0 }} textAlign={{ sm: 'center', md: 'left' }}>
                        <IoSearch color='#c73131' fontSize='3rem' />
                        <Text>No se encontraron artículos</Text>
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

              <Box w='100%' display='flex' alignItems='center' justifyContent='space-between'>
                <Text fontWeight="normal" mt='0.5rem' color='gray.600' lineHeight="normal" fontSize={'sm'}>
                  * Todas las imágenes son meramente ilustrativas</Text>
                <Text fontWeight="normal" mt='0.5rem' color='gray.600' lineHeight="normal" fontSize={'sm'}>
                  Desarrollado por <a href="https://github.com/en44no/" target="_blank" style={{ color: '#778eda', textDecoration: 'underline' }}>en44no</a></Text>
              </Box>

              <Modal isOpen={isOpen} size='md' onClose={onCloseModal} isCentered>
                <ModalOverlay backdropFilter='auto'
                  backdropBlur='2px' />
                <ModalContent bg='#1e2227'>
                  <ModalHeader>{selectedSkin.Nombre}</ModalHeader>
                  <ModalCloseButton _focus={{ 'boxShadow': 'none' }} _focusVisible={{ 'boxShadow': 'none' }} mt='0.5rem' />

                  <Box borderBottom='1px solid #d13535' mr='1.6rem' ml='1.6rem'></Box>

                  <ModalBody pb='1.5rem' mt='1rem' display={{ sm: 'flex', md: 'block' }} alignItems={{ sm: 'center', md: '' }} justifyContent={{ sm: 'center', md: '' }}>

                    <Box key={selectedSkin.Nombre} w='100%' position='relative' mt='-0.2rem' p='0.5rem' bg='#23272e' borderRadius='9px' boxShadow='md'>
                      <Box position='relative' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                        <Box className={isMobile ? 'skin-image-container' : 'scale-image'} display='flex' justifyContent='center' w='100%' maxH='15rem' h='auto'>
                          <Img layout='responsive' className="shadow-for-skin-image" alt={selectedSkin.Nombre} width={{ sm: '14rem', md: '18rem' }} height='auto' style={{ 'objectFit': "cover" }} src={selectedSkin.ImagenURL}></Img>
                        </Box>

                        <Box display='flex' pb='0.5rem' mt='-0.5rem'>

                          {selectedSkin.Stickers?.map((sticker, index) => (
                            <TooltipP key={sticker.Nombre + `sticker ${index}`} label={sticker.Nombre}>
                              <Box className={isMobile ? 'skin-image-container' : 'scale-image'}>
                                <Img layout='responsive' className="shadow-for-skin-image" alt={sticker.Nombre + `sticker ${index}`} width='6rem' height='6rem' style={{ objectFit: "cover", scale: isMobile ? '1.3' : '1.4' }} src={sticker.Link}></Img>
                              </Box>
                            </TooltipP>
                          ))}

                        </Box>

                      </Box>

                      <Box w='100%' px={3} display='flex' flexDir='column'>

                        {selectedSkin.Float && selectedSkin.Wear && (
                          <Box display='flex' flexDir='column' justifyContent='space-between' w='100%' pt={1}>

                            <Box display='flex' w='100%' h='8px' position='relative'>

                              <Box position='absolute' top='-1.1rem' ml='-9px' left={`${selectedSkin.Float * 100}%`}>
                                <TiArrowSortedDown fontSize='1.3rem' />
                              </Box>

                              <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label='Factory New' aria-label='Factory New'>
                                <Box w='7%' bg='#3d818f' borderRadius='50px 0 0 50px'></Box>
                              </Tooltip>

                              <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label='Minimal Wear' aria-label='Minimal Wear'>
                                <Box w='8%' bg='#84b235'></Box>
                              </Tooltip>

                              <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label='Field Tested' aria-label='Field Tested'>
                                <Box w='23%' bg='#dfc04a'></Box>
                              </Tooltip>

                              <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label='Well Worn' aria-label='Well Worn'>
                                <Box w='7%' bg='#ef8641'></Box>
                              </Tooltip>

                              <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label='Battle Scarred' aria-label='Battle Scarred'>
                                <Box w='55%' bg='#eb5757' borderRadius='0 50px 50px 0'></Box>
                              </Tooltip>

                            </Box>

                            <Box display='flex' justifyContent='space-between' pt={1}>

                              <Box display='flex' alignItems='center' gap={1}>
                                <Text color='grey' fontWeight="500" fontSize='sm'>Float</Text>
                                <Divider orientation="vertical" h='70%' alignSelf='center' borderLeftWidth='2px' borderColor='#808080' />
                                <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin.Float?.slice(0, 5)}</Text>
                              </Box>

                              <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin.Wear}</Text>
                            </Box>

                          </Box>
                        )}

                        {selectedSkin.StatTrak == 'TRUE' && (
                          <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='left' label="Este artículo registra el número de víctimas" aria-label="Este artículo registra el número de víctimas">
                            <Box display='flex' alignItems='center' position='absolute' gap={2} top='0.7rem' left='1.1rem'>
                              <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(188, 115, 77, .15)' borderRadius='9px'>
                                <Text color='#bc734d' fontWeight='600' fontSize='sm'>StatTrack</Text>
                              </Box>
                            </Box>
                          </Tooltip>
                        )}

                        {selectedSkin.TradeLock ? (
                          <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='right' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                            <Box display='flex' alignItems='center' position='absolute' gap={2} top='0.7rem' right={isMobile ? '0.7rem' : '0.8rem'}>
                              <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(208, 56, 56, .15)' borderRadius='9px'>
                                <Text color='#cd6060' fontWeight='600' fontSize='sm'>TradeLock {selectedSkin.TradeLock}</Text>
                                <HiLockClosed color='#cd6060' fontSize='1.2rem' />
                              </Box>
                            </Box>
                          </Tooltip>
                        ) : (
                          <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='right' label="Este artículo está disponible para ser enviado inmediatamente">
                            <Box display='flex' alignItems='center' position='absolute' gap={2} top='0.7rem' right={isMobile ? '0.7rem' : '0.8rem'}>
                              <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(81, 161, 81, .15)' borderRadius='9px'>
                                <Text color='#5fad68' fontWeight='600' fontSize='sm'>Desbloqueado</Text>
                                <HiLockOpen color="#5fad68" fontSize='1.2rem' />
                              </Box>
                            </Box>
                          </Tooltip>
                        )}

                        {selectedSkin.InspeccionarLink && !isMobile && (
                          <Link onClick={() => playGoGoGoSound()} w='100%' href={selectedSkin.InspeccionarLink} rel="noopener noreferrer" target="_blank">
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
