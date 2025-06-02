import { View, Text } from 'react-native'
import React, { createContext, useState, useContext } from 'react'
// import { Request } from '@/assets/data/requests'
import { Request } from '@/src/api/index'
import { randomUUID } from 'expo-crypto';

type RequestContextType = {
  requests: Request[];
  addRequest: (newRequest: Request) => void;
};

export const RequestContext = createContext<RequestContextType>({
  requests: [],
  addRequest: () => {}
});

const RequestProvider = ({children}: {children: React.ReactNode}) => {
  const [requests, setRequest] = useState<Request[]>([]);
  const addRequest = (newRequest: Request) => {
    console.log(newRequest);
    setRequest([...requests, newRequest]);
  }
  return (
    <RequestContext.Provider
    value={{requests, addRequest}}
    >
      {children}
    </RequestContext.Provider>
  )
}

export default RequestProvider
export const useRequest = () => useContext(RequestContext);