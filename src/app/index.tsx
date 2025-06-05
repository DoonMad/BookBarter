import { View, Text, Button } from 'react-native'
import React from 'react'
import { Link, Redirect, router } from 'expo-router'
import { useAuth } from '../contexts/AuthProvider'
import { ActivityIndicator } from 'react-native-paper'
import { supabase, supabaseAdmin } from '../lib/supabase'

const index = () => {
  const {session, sessionLoading} = useAuth()
  if(sessionLoading){
    return <ActivityIndicator />
  }
  if(!session){
    return <Redirect href='/(auth)/SignIn' />
  }
  return (
    <View className='flex-1 justify-center align-center p-5 gap-5 bg-cyan-100'>
      <Button title='SignIn' onPress={() => router.push('/(auth)/SignIn')} />
      <Button title='Explore' onPress={() => router.push('/(tabs)/explore')} />
      <Button title='Sign Out' onPress={() => supabase.auth.signOut()} />
      <Button title='Delete Account' onPress={() => supabaseAdmin.auth.admin.deleteUser(session.user.id)} /> 
    </View>
  )
}

export default index