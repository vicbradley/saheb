"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext({});

export const CartContextProvider = ({ children }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  const [cartProductsLength, setCartProductsLength] = useState(0);

  const [cart, setCart] = useState([]);


  return <CartContext.Provider value={{ totalPrice, setTotalPrice, cartProductsLength, setCartProductsLength, cart, setCart }}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);
