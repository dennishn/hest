import { ChakraProvider } from "@chakra-ui/react";

function EccoApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default EccoApp;
