import { View, Text, Pressable, useColorScheme } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const Explore = () => {
  const colorScheme = useColorScheme()
  return (
    <Stack>
        <Stack.Screen 
        name="index"
        options={{
          title: 'Explore',
          // headerShown: false,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="bell"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
        />
    </Stack>
  )
}

export default Explore