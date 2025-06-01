import { View, Text } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

type AuthData = {
  session: Session | null
  sessionLoading: boolean
}

const AuthContext = React.createContext<AuthData>({
  session: null,
  sessionLoading: true
})

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async() => {
      const {data, error} = await supabase.auth.getSession();
      if(error){
        console.error(error);
      }
      setSession(data.session);
      setLoading(false);
    }
    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  }, []);


  return (
    <AuthContext.Provider value={{session, sessionLoading}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export const useAuth = () => useContext(AuthContext);