import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
   const [PythonResult, setPythonResult] = useState()
   return (
    <UserContext.Provider value={{ PythonResult,setPythonResult }}>
      {children}
    </UserContext.Provider>
  );
}  

export const UserData = () => {
    return useContext(UserContext);
  };