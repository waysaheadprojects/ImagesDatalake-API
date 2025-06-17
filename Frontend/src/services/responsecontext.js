// context/ResponseContext.js
import { createContext, useState, useContext } from 'react';

const ResponseContext = createContext();
const InputDataContext = createContext();


export const ResponseProvider = ({ children }) => {
  const [responseData, setResponseData] = useState(null);

  return (
    <ResponseContext.Provider value={{ responseData, setResponseData }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const InputDataQueryProvider = ({ children }) => {
  const [query, setQuery] = useState(null);

  return (
    <InputDataContext.Provider value={{ query, setQuery }}>
      {children}
    </InputDataContext.Provider>
  );
};

export const useQueryData=()=>useContext(InputDataContext);
export const useResponse = () => useContext(ResponseContext);
