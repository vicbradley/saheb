import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { AuthContextProvider } from "./context/Auth";
import { CartContextProvider } from "./context/Cart";
import { MessageContextProvider } from "./context/Message";
import "@fontsource/titan-one";
import ChakraUiProvider from "@/src/provider/chakra-ui.provider";
import TanstackProvider from "@/src/provider/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Saheb",
  description: "Sahabat hewan bahagia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <TanstackProvider>
          <AuthContextProvider>
            <CartContextProvider>
              <MessageContextProvider>
                <ChakraUiProvider>
                  <Navbar />
                  {children}
                </ChakraUiProvider>
              </MessageContextProvider>
            </CartContextProvider>
          </AuthContextProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
