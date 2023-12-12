"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext({});

export const CartContextProvider = ({ children }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  const [cartItemsCount, setCartItemsCount] = useState(0);

  const [cartProducts, setCartProducts] = useState([]);


  return <CartContext.Provider value={{ totalPrice, setTotalPrice, cartItemsCount, setCartItemsCount, cartProducts, setCartProducts }}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);
