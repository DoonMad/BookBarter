import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

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