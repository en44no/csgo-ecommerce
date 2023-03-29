import { ChakraProvider } from '@chakra-ui/react'
import '../styles/styles.css'

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
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
