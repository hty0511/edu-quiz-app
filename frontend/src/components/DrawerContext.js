import React, { createContext, useState, useContext } from "react";

const DrawerContext = createContext();

export const useDrawer = () => {
  return useContext(DrawerContext);
};

export const DrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};
