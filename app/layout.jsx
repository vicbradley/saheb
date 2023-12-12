import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { AuthContextProvider } from "./context/Auth";
import { CartContextProvider } from "./context/Cart";
import { MessageContextProvider } from "./context/Message";
// import { ChakraProvider } from "@chakra-ui/react";
import { Alfa_Slab_One } from "next/font/google";
import "@fontsource/titan-one";
import ChakraUiProvider from "@/src/provider/chakra-ui.provider";

const inter = Inter({ subsets: ["latin"] });
const alfaSlabOne = Alfa_Slab_One({ subsets: ["latin"], weight: "400" });
// const dancingScript = Dancing_Script({ subsets: ["latin"] });

export const metadata = {
  title: "Saheb",
  description: "Sahabat hewan bahagia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      {/* <body className="bg-[#001a9d] min-h-full min-w-full"> */}
      <body>
        {/* <AuthContextProvider>
            <Theme>
              <ChakraProvider theme={theme}>
                <Navbar />
                {children}
              </ChakraProvider>
            </Theme>
          </CartContextProvider>
        </AuthContextProvider> */}

        <AuthContextProvider>
          <CartContextProvider>
            <MessageContextProvider>
              {/* <Theme > */}
              <ChakraUiProvider>
                <Navbar />
                {children}
              </ChakraUiProvider>
              {/* </Theme> */}
            </MessageContextProvider>
          </CartContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
