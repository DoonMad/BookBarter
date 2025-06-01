import { View, Text } from 'react-native'
import React from 'react'

type AuthData = {}

const AuthContext = React.createContext<AuthData>({})

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider