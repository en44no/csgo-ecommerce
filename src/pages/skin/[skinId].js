import { useRouter } from "next/router";
import HeaderText from "../../components/HeaderText";
import { Box, Button, Container, Divider, Img, Spinner, Text, useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiLockClosed, HiLockOpen } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FiExternalLink } from 'react-icons/fi';
import { TbShare3 } from 'react-icons/tb';
import { Tooltip } from '@chakra-ui/react'
import Info from "../../components/Info";
import TooltipP from "../../components/Tooltip";
import api from "../api/api";
import { RiVolumeMuteLine, RiVolumeUpLine } from "react-icons/ri";
import { FaAngleLeft } from "react-icons/fa";
import { useToast } from '@chakra-ui/react'

export default function SkinPage() {
  const [isMobile] = useMediaQuery('(max-width: 479px)');
  const router = useRouter()
  const toast = useToast()
  const toastId = 'urlCopiedToast'

  const { skinId } = router.query;

  const [skin, setSkin] = useState({});
  const [infoIsLoading, setInfoIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [soundIsEnabled, setSoundIsEnabled] = useState(false);

  useEffect(() => {
    setAwpScopeAudio(new Audio('/sounds/awp-zoom.mp3'));
    setAwpShootAudio(new Audio('/sounds/awp-shoot.mp3'));
    setGoGoGoAudio(new Audio('/sounds/go-go-go.mp3'));

    setSoundIsEnabled(false);

    fetchData();
  }, [skinId]);

  const fetchData = async () => {
    const skin = await api.skins.getSkinById(skinId);
    setSkin(skin);

    setIsLoading(false);
  };

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
    if (!skin?.Nombre) return;

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

  function onShare() {
    let url = window.location.href;
    navigator.clipboard.writeText(url);

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
        <title>{skin?.Nombre ? `Cajas por skins | ${skin.Nombre}` : 'Cajas por skins'}</title>
        <meta name="description" content="Cambia tus CAJAS por SKINS" />
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

          <Box pb='2rem' overflowX={isLoading || infoIsLoading ? 'hidden' : 'auto'} mt={isLoading || infoIsLoading ? '-2rem' : null} h={isLoading || infoIsLoading ? '0rem' : 'auto'} visibility={isLoading || infoIsLoading ? 'hidden' : 'initial'}>

            <HeaderText />

            <Info onInfoIsLoaded={() => setInfoIsLoading(false)} />

            <Box display="flex" flexDirection="column" width="100%">

              <Button onClick={() => router.push("/")} w='100%' leftIcon={<FaAngleLeft fontSize='1.1rem' style={{ marginRight: '-0.3rem' }} />} fontSize='sm' mb='1rem' bg='transparent' border='1px solid #d13535' _hover={{ 'bg': '#d13535', 'color': '#fff' }} borderRadius='9px'>VOLVER AL INICIO</Button>

              <Box id='skins-container' w='100%' display='flex' flexDir={{ sm: 'column', md: 'row', lg: 'row' }} alignItems='center' justifyContent='space-between'>
                <Text fontWeight="800" lineHeight="normal" bgGradient="linear(to-r, red.500, red.600, red.500)" bgClip="text" mr='0.5rem' fontSize={'3xl'}>{skin?.Nombre}</Text>

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

              <Box w='100%' pb='1.5rem' mt='1rem' display='flex' alignItems={{ sm: 'center', md: '' }} justifyContent={{ sm: 'center', md: '' }} position='relative' p='1.5rem' bg='#23272e' borderRadius='9px' px='10rem'>

                <Box w='100%' display='flex' bg='#1e2227' p='1.5rem' borderRadius='9px'>
                  <Box w='60%'>
                    <Box key={skin?.Nombre}>

                      <Box position='relative' display='flex' justifyContent='center' flexDirection='column' w='100%' alignItems='center' gap={2} mt={skin?.Stickers?.length > 0 && '-1.5rem'}>
                        <Box className={isMobile ? 'skin-image-container' : 'scale-image'} display='flex' justifyContent='center' maxH='15rem' h='auto'>
                          <Img layout='responsive' style={getStyleForImageOnModal(skin)} className="shadow-for-skin-image" alt={skin?.Nombre} width={{ sm: () => getWidthForImageOnModal(skin, 'sm'), md: () => getWidthForImageOnModal(skin, 'md') }} height='auto' src={skin?.ImagenURL}></Img>
                        </Box>


                        <Box display='flex' mt='-1rem'>

                          {skin?.Stickers?.map((sticker, index) => (
                            <TooltipP key={sticker?.Nombre + `sticker ${index}`} label={sticker?.Nombre}>
                              <Box className={isMobile ? 'skin-image-container' : 'scale-image'}>
                                <Img layout='responsive' className="shadow-for-skin-image" alt={sticker?.Nombre + `sticker ${index}`} width='5.5rem' height='5.5rem' style={{ objectFit: "cover", scale: isMobile ? '1.3' : '1.4' }} src={sticker?.Link}></Img>
                              </Box>
                            </TooltipP>
                          ))}

                        </Box>

                      </Box>

                    </Box>

                  </Box>

                  <Box w='40%' background='#23272e' position='relative'
                    padding='1rem' borderRadius='9px' display='flex' flexDirection='column'>

                    <Box w='100%' display='flex' justifyContent='space-between'>
                      <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label="Este artículo registra el número de víctimas" aria-label="Este artículo registra el número de víctimas">
                        <Box display='flex' alignItems='center' gap={2}>
                          <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(188, 115, 77, .15)' borderRadius='9px'>
                            <Text color='#bc734d' fontWeight='600' fontSize='sm'>StatTrack</Text>
                          </Box>
                        </Box>
                      </Tooltip>

                      {skin?.TradeLock ? (
                        <Tooltip bg='#2d3748' color='#ffffff' borderRadius='9px' placement='top' label="Este artículo tiene un bloqueo de intercambio por parte de Steam" aria-label="Este artículo tiene un bloqueo de intercambio por parte de Steam">
                          <Box display='flex' alignItems='center' gap={2}>
                            <Box display='flex' gap={1} w='fit-content' px='0.5rem' py='0.2rem' alignItems='center' bg='rgb(208, 56, 56, .15)' borderRadius='9px'>
                              <Text color='#cd6060' fontWeight='600' fontSize='sm'>TradeLock {skin.TradeLock}</Text>
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

                    <Box w='100%' h='100%' justifyContent='flex-end' display='flex' flexDir='column' mt='1.5rem'>

                      {skin?.Float && skin?.Wear && (
                        <Box display='flex' flexDir='column' justifyContent='space-between' w='100%' pt={1}>

                          <Box display='flex' w='100%' h='8px' position='relative'>

                            <Box position='absolute' top='-1.1rem' ml='-9px' left={`${skin?.Float * 100}%`}>
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
                              <Text color='grey' fontWeight="500" fontSize='sm'>{skin?.Float?.slice(0, 5)}</Text>
                            </Box>

                            <Text color='grey' fontWeight="500" fontSize='sm'>{skin?.Wear}</Text>
                          </Box>

                        </Box>
                      )}

                      {skin?.InspeccionarLink && !isMobile && (
                        <Link onClick={() => playGoGoGoSound()} w='100%' href={skin?.InspeccionarLink} rel="noopener noreferrer" target="_blank">
                          <Button w='100%' leftIcon={<FiExternalLink fontSize='1.1rem' />} fontSize='sm' mt='1rem' mb='0.5rem' bg='transparent' border='1px solid #d13535' _hover={{ 'bg': '#d13535', 'color': '#fff' }} borderRadius='9px'>Inspeccionar en el juego</Button>
                        </Link>
                      )}

                      <Button onClick={() => onShare()} w='100%' leftIcon={<TbShare3 fontSize='1.2rem' />} fontSize='sm' mt='0.3rem' bg='transparent' border='1px solid #d13535' _hover={{ 'bg': '#d13535', 'color': '#fff' }} borderRadius='9px'>Compartir</Button>
                    </Box>

                  </Box>
                </Box>

              </Box>
            </Box>
          </Box>

          {isLoading || infoIsLoading && (
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