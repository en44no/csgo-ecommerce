import { Box, Button, Container, Divider, Input, InputGroup, Img, InputRightElement, Spinner, Text, useDisclosure, useMediaQuery, Select, FormControl, FormLabel, Switch, useToast } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "./api/api";
import { HiLockClosed, HiLockOpen } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { RiVolumeUpLine, RiVolumeMuteLine } from 'react-icons/ri';
import { FiExternalLink } from 'react-icons/fi';
import { IoSearch, IoClose } from 'react-icons/io5';
import { Tooltip } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import Info from "../components/Info";
import HeaderText from "../components/HeaderText";
import TooltipP from "../components/Tooltip";
import ReactModal from 'react-modal';
import { useRouter } from "next/router";
import { TbShare3 } from "react-icons/tb";

ReactModal.setAppElement('#__next');

export default function Home() {
  const router = useRouter();

  const [skins, setSkins] = useState([]);
  const [selectedSkin, setSelectedSkin] = useState({});
  const [paginatorItems, setPaginatorItems] = useState(25);
  const [infoIsLoading, setInfoIsLoading] = useState(true);
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
  const [orderFilter, setOrderFilter] = useState('default');

  const [isMobile] = useMediaQuery('(max-width: 479px)');

  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()
  const toastId = 'urlCopiedToast'

  useEffect(() => {
    if (isMobile) {
      setPaginatorItems(18);
    }

    setAwpScopeAudio(new Audio('/sounds/awp-zoom.mp3'));
    setAwpShootAudio(new Audio('/sounds/awp-shoot.mp3'));
    setGoGoGoAudio(new Audio('/sounds/go-go-go.mp3'));

    setSoundIsEnabled(false);
    setSearchText('');

    setLoading(true);
    setSkinsAreLoading(true);
  }, []);

  useEffect(() => {
    debugger;
    const page = Number(router.query.page) || 1;

    setCurrentPage(page);
    fetchData(page);

  }, [router.query]);

  const fetchData = async (page) => {
    const skins = await api.skins.get();

    //reset filters
    setShowLockedItemsFilter(true);
    setSearchText('');
    setOrderFilter('default');

    setSkins(skins);
    setFilteredSkins(skins);
    generatePaginator(skins);

    setSkinsBasedOnPage(page ? page : 1, skins);

    setSkinsAreLoading(false);
    setLoading(false);
  };

  function onOpenModal(skin) {
    playShootSound();
    setSelectedSkin(skin);
  }

  function onCloseModal() {
    setSelectedSkin({});
  }

  function onChangeSearchText(text) {
    setSearchInputIsLoading(true);
    setSearchText(text);
    setFilters(text);
    setSearchInputIsLoading(false);
  }

  function onShowLockedItemsChange(show) {
    setShowLockedItemsFilter(show);
    setFilters(searchText, show);
  }

  function onOrderChange(order) {
    setOrderFilter(order);
    setFilters(searchText, showLockedItemsFilter, order);
  }

  function generatePaginator(skins) {
    const paginator = [];
    for (let i = 0; i < skins.length / paginatorItems; i++) {
      paginator.push(i + 1);
    }
    setPaginator(paginator);
  }

  function onPageChange(newPage) {
    router.push(`/?page=${newPage}`, undefined, { scroll: false });
    setCurrentPage(newPage);
    setSkinsBasedOnPage(newPage);
    //document.getElementById('skins-container').scrollIntoView();
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

  const setFilters = (text, showLockedItems, order) => {
    let skinsWithFilters = filteredSkins ? filteredSkins : [...skins];
    let allSkinsCopy = [...skins];

    let textFilterPrivate = text != null ? text : searchText;
    let tradeLockFilterPrivate = showLockedItems != null ? showLockedItems : showLockedItemsFilter;
    let orderFilterPrivate = order != null ? order : orderFilter;

    if (textFilterPrivate) {
      skinsWithFilters = allSkinsCopy.filter(skin => {
        let name = skin.Nombre.toLowerCase().normalize('NFD').replace(/[^\w\s]/gi, '').replace(/\s+/g, '').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '');
        let text = textFilterPrivate.toLowerCase().normalize('NFD').replace(/[^\w\s]/gi, '').replace(/\s+/g, '').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '');

        return name.includes(text) ? skin : null;
      });
    }

    if (tradeLockFilterPrivate == false) {
      skinsWithFilters = skinsWithFilters.filter(skin => {
        return skin.TradeLock == null || skin.TradeLock == 'FALSE' ? skin : null;
      });
    } else if (tradeLockFilterPrivate == true) {
      if (textFilterPrivate) {
        skinsWithFilters = allSkinsCopy.filter(skin => {
          let name = skin.Nombre.toLowerCase().normalize('NFD').replace(/[^\w\s]/gi, '').replace(/\s+/g, '').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '');
          let text = textFilterPrivate.toLowerCase().normalize('NFD').replace(/[^\w\s]/gi, '').replace(/\s+/g, '').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '');

          return name.includes(text) ? skin : null;
        });
        skinsWithFilters = skinsWithFilters;
      } else {
        skinsWithFilters = allSkinsCopy;
      }
    }

    if (orderFilterPrivate) {
      if (orderFilterPrivate == 'lower') {
        skinsWithFilters = skinsWithFilters.sort((a, b) => a.Float - b.Float);
      } else if (orderFilterPrivate == 'higher') {
        skinsWithFilters = skinsWithFilters.sort((a, b) => b.Float - a.Float);
      }
    }

    setFilteredSkins(skinsWithFilters);
    setSkinsBasedOnPage(currentPage, skinsWithFilters);
  };


  function setSkinsBasedOnPage(page, skinsToFilter) {
    let skinsForPage = [];
    if (skinsToFilter) {
      skinsForPage = skinsToFilter.slice((page - 1) * paginatorItems, page * paginatorItems);
    } else {
      skinsForPage = filteredSkins.slice((page - 1) * paginatorItems, page * paginatorItems);
    }

    if (skinsForPage.length == 0) {
      let currentPageToCheck = currentPage;
      while (currentPageToCheck >= 0) { // mientras no lleguemos a la primera página
        let skinsOnCurrentPage = [];
        if (skinsToFilter) {
          skinsOnCurrentPage = skinsToFilter.slice((currentPageToCheck - 1) * paginatorItems, currentPageToCheck * paginatorItems);
        } else {
          skinsOnCurrentPage = filteredSkins.slice((currentPageToCheck - 1) * paginatorItems, currentPageToCheck * paginatorItems);
        }
        if (skinsOnCurrentPage.length > 0) { // si hay skins en la página actual
          skinsForPage = skinsOnCurrentPage;
          break; // salimos del loop
        } else { // si no hay skins en la página actual (estamos en una página vacía)
          currentPageToCheck = currentPageToCheck - 1  // retrocedemos una página
          setCurrentPage(currentPageToCheck);
          if (currentPageToCheck == 0) {
            setCurrentPage(1);
            break;
          } // si llegamos a la primera página, salimos del loop (no hay skins en ninguna página
        }
        if (currentPageToCheck == 0) break; // si llegamos a la primera página, salimos del loop (no hay skins en ninguna página

      }
    }

    setSkinsForCurrentPage(skinsForPage);
    generatePaginator(skinsToFilter ? skinsToFilter : filteredSkins);
    return skinsForPage;
  }

  function getStyleForImageOnModal(skin) {
    if (!skin?.Nombre) return;

    let style = {
      objectFit: 'cover',
    }

    if (!skin.Float && skin.Stickers?.length == 0) {
      return {
        ...style,
        marginTop: '2rem',
        marginBottom: '-1rem'
      }
    }
    else {
      return style;
    }
  }

  function getWidthForImageOnModal(skin, size) {
    if (skin.Nombre.includes('Music Kit')) {
      if (size == 'sm') {
        return '12rem';
      } else {
        return '16rem';
      }
    }
    else if (skin.Nombre.includes('Sticker')) {
      if (size == 'sm') {
        return '12rem';
      } else {
        return '16rem';
      }
    }

    else {
      if (size == 'sm') {
        return '14rem';
      } else {
        return '18rem';
      }
    }
  }

  function onShare(selectedSkin) {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const urlWithoutPage = `${origin}${pathname}`;

    navigator.clipboard.writeText(urlWithoutPage);

    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        title: "URL copiada al portapapeles",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head>
        <title>Cajas por skins</title>
        <meta name="description" content="Cambia tus CAJAS por SKINS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQxnaecIT8Wv9rilYTYkfTyNuiFwmhUvpZz3-2Z9oqg0Vew80NvZzuiJdeLMlhpwFO-XdA/330x192" />
      </Head>
      <main>

        <ReactModal
          isOpen={!!router.query.skinId}
          onRequestClose={() => router.push(`/?page=${currentPage}`)}
          style={{
            overlay: {
              position: 'fixed',
              zIndex: 1020,
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgb(15, 17, 20, 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            content: {
              background: '#1e2227',
              width: '30rem',
              position: 'relative',
              border: 'none',
              borderRadius: '0.3rem',
              padding: '0rem 1.5rem',
              inset: 0,
              margin: isMobile ? '1rem' : '0'
            }
          }}
        >

          <Box>

            <Box mt='1rem' pb='0.5rem' display='flex' justifyContent='space-between' alignItems='center'>
              <Box fontWeight='semibold'>{selectedSkin.Nombre}</Box>
              <Box onClick={() => router.push(`/?page=${currentPage}`)} cursor='pointer' p='0.25rem' borderRadius='9px' _hover={{ background: 'rgb(15, 17, 20, 30%)' }}>
                <IoClose fontSize='1.4rem' />
              </Box>
            </Box>

            <Box borderBottom='1px solid #d13535'></Box>

            <Box pb='1.5rem' mt='1rem' display={{ sm: 'flex', md: 'block' }} alignItems={{ sm: 'center', md: '' }} justifyContent={{ sm: 'center', md: '' }}>

              <Box key={selectedSkin.Nombre} w='100%' position='relative' mt='-0.2rem' p='0.5rem' borderRadius='9px'>
                <Box position='relative' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                  <Box className={isMobile ? 'skin-image-container' : 'scale-image'} display='flex' justifyContent='center' w='100%' maxH='15rem' h='auto'>
                    <Img layout='responsive' style={getStyleForImageOnModal(selectedSkin)} className="shadow-for-skin-image" alt={selectedSkin.Nombre} width={{ sm: () => getWidthForImageOnModal(selectedSkin, 'sm'), md: () => getWidthForImageOnModal(selectedSkin, 'md') }} height='auto' src={selectedSkin.ImagenURL}></Img>
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

                <Box w='100%' background='#23272e' position='relative'
                  padding='1rem' borderRadius='9px' display='flex' flexDirection='column'>

                  <Box w='100%' display='flex' justifyContent='space-between'>

                    <Box>
                      {selectedSkin?.StatTrack && (
                        <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label="Este artículo registra el número de víctimas" aria-label="Este artículo registra el número de víctimas">
                          <Box display='flex' alignItems='center' gap={2}>
                            <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(188, 115, 77, .15)' borderRadius='9px'>
                              <Text color='#bc734d' fontWeight='600' fontSize='sm'>StatTrack</Text>
                            </Box>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>

                    <Box>
                      {selectedSkin?.TradeLock ? (
                        <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                          <Box display='flex' alignItems='center' gap={2}>
                            <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(208, 56, 56, .15)' borderRadius='9px'>
                              <Text color='#cd6060' fontWeight='600' fontSize='sm'>TradeLock {selectedSkin.TradeLock}</Text>
                              <HiLockClosed color='#cd6060' fontSize='1.2rem' />
                            </Box>
                          </Box>
                        </Tooltip>
                      ) : (
                        <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label="Este artículo está disponible para ser enviado inmediatamente">
                          <Box display='flex' alignItems='center' gap={2}>
                            <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(81, 161, 81, .15)' borderRadius='9px'>
                              <Text color='#5fad68' fontWeight='600' fontSize='sm'>Desbloqueado</Text>
                              <HiLockOpen color="#5fad68" fontSize='1.2rem' />
                            </Box>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>

                  </Box>

                  <Box w='100%' h='100%' justifyContent='flex-end' display='flex' flexDir='column' mt='1.5rem'>

                    {selectedSkin?.Float && selectedSkin?.Wear && (
                      <Box display='flex' flexDir='column' justifyContent='space-between' w='100%' pt={1}>

                        <Box display='flex' w='100%' h='8px' position='relative'>

                          <Box position='absolute' top='-1.1rem' ml='-9px' left={`${selectedSkin?.Float * 100}%`}>
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
                            <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin?.Float?.slice(0, 5)}</Text>
                          </Box>

                          <Text color='grey' fontWeight="500" fontSize='sm'>{selectedSkin?.Wear}</Text>
                        </Box>

                      </Box>
                    )}

                    {selectedSkin?.InspeccionarLink && !isMobile && (
                      <Link onClick={() => playGoGoGoSound()} w='100%' href={selectedSkin?.InspeccionarLink} rel="noopener noreferrer" target="_blank">
                        <Button w='100%' leftIcon={<FiExternalLink fontSize='1.1rem' />} fontSize='sm' mt='1rem' mb='0.5rem' bg='transparent' border='1px solid #d13535' _hover={{ 'bg': '#d13535', 'color': '#fff' }} borderRadius='9px'>Inspeccionar en el juego</Button>
                      </Link>
                    )}

                    <Button onClick={() => onShare(selectedSkin)} w='100%' leftIcon={<TbShare3 fontSize='1.2rem' />} fontSize='sm' mt='0.3rem' bg='transparent' border='1px solid #d13535' _hover={{ 'bg': '#d13535', 'color': '#fff' }} borderRadius='9px'>Compartir</Button>
                  </Box>

                </Box>

              </Box>

            </Box>
          </Box>
        </ReactModal>

        <Container
          as="section"
          w="100%"
          maxW="container.xl"
          position="relative"
          display="flex"
          flexDirection="column"
        >

          <Box pb='2rem' overflowX={loading || infoIsLoading ? 'hidden' : 'auto'} mt={loading || infoIsLoading ? '-2rem' : null} h={loading || infoIsLoading ? '0rem' : 'auto'} visibility={loading || infoIsLoading ? 'hidden' : 'initial'}>

            <HeaderText />

            <Info onInfoIsLoaded={() => setInfoIsLoading(false)} />

            <Box display="flex" flexDirection="column" width="100%">

              <Box id='skins-container' w='100%' display='flex' flexDir={{ sm: 'column', md: 'row', lg: 'row' }} alignItems='center' justifyContent='space-between'>
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
              <Box position='relative' display='flex' flexWrap='wrap' alignContent='flex-start' justifyContent='center' mt='1rem' gap={{ sm: 2, md: 6 }} bg='#23272e' py={4} px={0} borderRadius='9px' pb='4.5rem' minH='max-content'>

                <Box display='flex' flexDirection={{ sm: 'column', md: 'row' }} alignItems='center' gap={{ sm: 0, md: 3 }} justifyContent={{ sm: '', md: 'space-between' }} w='100%' mx={{ sm: 0, md: '3.5rem' }} mb='-0.5rem'>

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

                    <Select onChange={(e) => onOrderChange(e.target.value)} w='fit-content' fontSize='sm' bg='transparent' border='none' borderRadius='0' borderBottom='1px solid #d13535' cursor='pointer' _hover={{ 'borderBottom': '1px solid #d13535' }} _focusVisible={{ 'borderBottom': '1px solid #d13535' }} _focus={{ 'borderBottom': '1px solid #d13535' }}>
                      <option style={{ background: '#1e2227' }} value='default' selected>Defecto</option>
                      <option style={{ background: '#1e2227' }} value='lower'> Float más bajo</option>
                      <option style={{ background: '#1e2227' }} value='higher'>Float más alto</option>
                    </Select>

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
                  <Link href={`/?skinId=${skin.Id}&page=${currentPage}`} as={`/skin/${skin.Id}/?page=${currentPage}`}>
                    <Box onMouseOver={playScopeSound} onMouseLeave={pauseScopeSound} onClick={() => onOpenModal(skin)} key={skin.Nombre + skin.Float + index} position='relative' bg='#1e2227' h={{ sm: 'auto', md: '10.5rem' }} minW={{ sm: '11rem', md: '13rem' }} w={{ sm: '11rem', md: '13rem' }} _hover={{ 'bg': '#3f3f45' }} cursor='pointer' borderRadius='9px'>
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

                                <Box w={'7%'} bg='#3d818f' borderRadius='50px 0 0 50px'></Box>

                                <Box w={'8%'} bg='#84b235'></Box>

                                <Box w={'23%'} bg='#dfc04a'></Box>

                                <Box w={'7%'} bg='#ef8641'></Box>

                                <Box w={'55%'} bg='#eb5757' borderRadius='0 50px 50px 0'></Box>
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
                  </Link>
                ))}

                {paginator.length > 0 && skinsForCurrentPage != 0 && (
                  <Box display='flex' justifyContent='center' alignItems='center' w='100%' gap={3} position='absolute' bottom='1rem'>
                    <>
                      <Text display={{ sm: 'none', md: 'flex' }} color='grey'>Mostrando {(((currentPage - 1) * paginatorItems) + 1) == 1 ? '01' : ((currentPage - 1) * paginatorItems) + 1}-{(currentPage * paginatorItems) > skins.length ? skins.length : (currentPage * paginatorItems)} de {filteredSkins.length} artículos</Text>
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
                        if (page > currentPage + 2) {
                          return null;
                        }
                        if (page < currentPage - 2) {
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
              <ModalContent bg='#1e2227' m={{ sm: '1rem', md: null }}>
                <ModalHeader>{selectedSkin.Nombre}</ModalHeader>
                <ModalCloseButton _focus={{ 'boxShadow': 'none' }} _focusVisible={{ 'boxShadow': 'none' }} mt='0.5rem' />

                <Box borderBottom='1px solid #d13535' mr='1.6rem' ml='1.6rem'></Box>

                <ModalBody pb='1.5rem' mt='1rem' display={{ sm: 'flex', md: 'block' }} alignItems={{ sm: 'center', md: '' }} justifyContent={{ sm: 'center', md: '' }}>

                  <Box key={selectedSkin.Nombre} w='100%' position='relative' mt='-0.2rem' p='0.5rem' bg='#23272e' borderRadius='9px'>
                    <Box position='relative' display='flex' flexDir='column' alignItems='center' gap={2} py={3} px={1}>
                      <Box className={isMobile ? 'skin-image-container' : 'scale-image'} display='flex' justifyContent='center' w='100%' maxH='15rem' h='auto'>
                        <Img layout='responsive' style={getStyleForImageOnModal(selectedSkin)} className="shadow-for-skin-image" alt={selectedSkin.Nombre} width={{ sm: () => getWidthForImageOnModal(selectedSkin, 'sm'), md: () => getWidthForImageOnModal(selectedSkin, 'md') }} height='auto' src={selectedSkin.ImagenURL}></Img>
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

          {(loading || infoIsLoading) && (
            <Box h='100vh' w='100%' display='flex' justifyContent='center' alignItems='center'>
              <Spinner
                size='xl'
              />
            </Box>
          )}

        </Container>
      </main >
    </>
  )
}
