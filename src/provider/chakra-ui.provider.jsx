'use client';

import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../theme/theme';

const ChakraUiProvider = ({ children }) => {
  return (
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
  )
}

export default ChakraUiProvider