import {  extendTheme } from "@chakra-ui/react";
import { fonts } from "./fonts";

export const theme = extendTheme({
  fonts,
  components: {
  /** Customize Chakra UI Components */
  },
  colors: {
    baseBlue: "#001a9d", 
  },
});