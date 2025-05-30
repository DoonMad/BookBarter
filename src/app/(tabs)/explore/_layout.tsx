import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Explore = () => {
  return (
    <Stack>
        <Stack.Screen 
        name="index"
        options={{title: "Explore"}}
        />
    </Stack>
  )
}

export default Explore