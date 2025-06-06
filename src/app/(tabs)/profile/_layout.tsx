import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/src/contexts/AuthProvider'
import { ActivityIndicator } from 'react-native-paper'

const ProfileLayout  = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name='EditProfile'
        options={{
          title: 'Edit Profile',
        }}
      />
    </Stack>
  )
}

export default ProfileLayout