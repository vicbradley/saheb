import { Montserrat,Titan_One, Alfa_Slab_One, Inter } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });
const titanOne = Titan_One({subsets: ["latin"], weight: "400"});
const alfaSlabOne = Alfa_Slab_One({subsets: ["latin"], weight: "400"});
const inter = Inter({subsets: ["latin"]});


/** App Fonts */
export const fonts = {
  body: inter.style.fontFamily,
  // heading: montserrat.style.fontFamily,
};