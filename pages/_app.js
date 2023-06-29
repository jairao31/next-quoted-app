import "@component/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "@component/context/AuthContext";
import theme from "@component/lib/theme";

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ChakraProvider>
    );
}
