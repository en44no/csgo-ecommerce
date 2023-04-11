import { ChakraProvider } from '@chakra-ui/react'
import '../styles/styles.css'

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

const breakpoints = {
  sm: '0em', // 0px to 479px, Mobile devices
  md: '30em', // 480px to 767px, iPads, Tablets
  lg: '48em', // 768px to 1023px, Small screens, laptops
  xl: '64em', // 1024px to 1599px, Desktops, large screens
  xxl: '100em' // 1600px to infinite, Extra large screens, TV
};


const theme = extendTheme({
  breakpoints,
  colors: {
    red: {
      50: '#d83838',
      100: '#d83838',
      200: '#d83838',
      300: '#d83838',
      400: '#d83838',
      500: '#d83838',
      600: '#d83838',
      700: '#d83838',
      800: '#d83838',
      900: '#d83838',
    }
  },
  styles: {
    global: () => ({
      body: {
        bg: '#1e2227',
        color: 'white'
      }
    })
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
